import type { User } from '@supabase/supabase-js'
import { modules } from '../data'
import { db, emptyProgress, type CustomQuizAttempt, type ExamAttempt, type LabProgress, type LessonProgress, type ModuleProgress, type ProgressSummary, type QuestionBookmark, type QuizAttempt } from '../db'
import { labs } from '../labs'
import { supabase } from '../lib/supabase'

interface ProgressSnapshot {
  progress: ProgressSummary
  moduleProgress: ModuleProgress[]
  lessonProgress: LessonProgress[]
  quizAttempts: QuizAttempt[]
  labProgress: LabProgress[]
  examAttempts: ExamAttempt[]
  customQuizAttempts: CustomQuizAttempt[]
  questionBookmarks: QuestionBookmark[]
}

let syncPromise: Promise<void> | null = null

export function syncProgress(user: User) {
  if (syncPromise) return syncPromise
  syncPromise = performSync(user).finally(() => { syncPromise = null })
  return syncPromise
}

export async function syncCurrentUserProgress() {
  if (!navigator.onLine) return
  const { data } = await supabase.auth.getSession()
  if (data.session?.user) await syncProgress(data.session.user)
}

async function performSync(user: User) {
  if (!navigator.onLine) return
  const local = await readLocalSnapshot()
  const { data: remoteRow, error } = await supabase.from('progress_snapshots').select('data').eq('user_id', user.id).maybeSingle()
  if (error) throw error
  const remote = isSnapshot(remoteRow?.data) ? remoteRow.data : null
  const merged = mergeSnapshots(local, remote)
  const { error: profileError } = await supabase.from('profiles').upsert({ user_id: user.id, display_name: user.user_metadata.display_name || user.email?.split('@')[0] || 'Learner', updated_at: new Date().toISOString() })
  if (profileError) throw profileError
  const { error: saveError } = await supabase.from('progress_snapshots').upsert({ user_id: user.id, data: merged, updated_at: new Date().toISOString() })
  if (saveError) throw saveError
  await writeLocalSnapshot(merged)
}

async function readLocalSnapshot(): Promise<ProgressSnapshot> {
  const [progress, moduleProgress, lessonProgress, quizAttempts, labProgress, examAttempts, customQuizAttempts, questionBookmarks] = await Promise.all([db.progress.get('current'), db.moduleProgress.toArray(), db.lessonProgress.toArray(), db.quizAttempts.toArray(), db.labProgress.toArray(), db.examAttempts.toArray(), db.customQuizAttempts.toArray(), db.questionBookmarks.toArray()])
  return { progress: { ...emptyProgress, ...progress }, moduleProgress, lessonProgress, quizAttempts, labProgress, examAttempts, customQuizAttempts, questionBookmarks }
}

function mergeSnapshots(local: ProgressSnapshot, remote: ProgressSnapshot | null): ProgressSnapshot {
  if (!remote) return { ...local, progress: calculateSummary(local) }
  const lessonProgress = uniqueBy([...local.lessonProgress, ...remote.lessonProgress], item => item.lessonId)
  const labProgress = uniqueBy([...local.labProgress, ...remote.labProgress], item => item.labId)
  const quizAttempts = uniqueBy([...local.quizAttempts, ...remote.quizAttempts], item => `${item.topicId}|${item.moduleId}|${item.score}|${item.total}|${item.completedAt}`).map(withoutId)
  const examAttempts = uniqueBy([...local.examAttempts, ...remote.examAttempts], item => `${item.questionIds.join(',')}|${item.score}|${item.total}|${item.durationSeconds}|${item.completedAt}`).map(withoutId)
  const customQuizAttempts = uniqueBy([...(local.customQuizAttempts ?? []), ...(remote.customQuizAttempts ?? [])], item => `${item.questionIds.join(',')}|${item.score}|${item.total}|${item.mode}|${item.completedAt}`).map(withoutId)
  const questionBookmarks = uniqueBy([...(local.questionBookmarks ?? []), ...(remote.questionBookmarks ?? [])], item => item.questionId)
  const moduleProgress = buildModuleProgress(lessonProgress)
  const merged = { progress: emptyProgress, moduleProgress, lessonProgress, quizAttempts, labProgress, examAttempts, customQuizAttempts, questionBookmarks }
  return { ...merged, progress: calculateSummary(merged) }
}

function calculateSummary(snapshot: Omit<ProgressSnapshot, 'progress'> | ProgressSnapshot): ProgressSummary {
  const activityDates = [...snapshot.lessonProgress.map(item => item.completedAt), ...snapshot.quizAttempts.map(item => item.completedAt), ...snapshot.labProgress.map(item => item.completedAt), ...snapshot.examAttempts.map(item => item.completedAt), ...(snapshot.customQuizAttempts ?? []).map(item => item.completedAt)].map(value => value.slice(0, 10)).sort()
  const uniqueDates = [...new Set(activityDates)]
  const quizMinutes = snapshot.quizAttempts.reduce((sum, item) => sum + Math.max(1, Math.ceil(item.total / 2)), 0)
  const examMinutes = snapshot.examAttempts.reduce((sum, item) => sum + Math.max(1, Math.ceil(item.durationSeconds / 60)), 0)
  const customMinutes = (snapshot.customQuizAttempts ?? []).reduce((sum, item) => sum + Math.max(1, Math.ceil(item.total / 2)), 0)
  const labMinutes = snapshot.labProgress.reduce((sum, item) => sum + (labs.find(lab => lab.id === item.labId)?.minutes ?? 0), 0)
  const allLessons = modules.flatMap(module => module.lessons)
  const lessonMinutes = snapshot.lessonProgress.reduce((sum, item) => sum + (allLessons.find(lesson => lesson.id === item.lessonId)?.duration ?? 0), 0)
  return { id: 'current', streakDays: calculateStreak(uniqueDates), studyMinutes: quizMinutes + examMinutes + customMinutes + labMinutes + lessonMinutes, lessonsCompleted: snapshot.lessonProgress.length, lastStudyDate: uniqueDates[uniqueDates.length - 1] ?? null, questionsAnswered: snapshot.quizAttempts.reduce((sum, item) => sum + item.total, 0) + snapshot.examAttempts.reduce((sum, item) => sum + item.total, 0) + (snapshot.customQuizAttempts ?? []).reduce((sum, item) => sum + item.total, 0), correctAnswers: snapshot.quizAttempts.reduce((sum, item) => sum + item.score, 0) + snapshot.examAttempts.reduce((sum, item) => sum + item.score, 0) + (snapshot.customQuizAttempts ?? []).reduce((sum, item) => sum + item.score, 0) }
}

function calculateStreak(dates: string[]) {
  if (!dates.length) return 0
  let streak = 1
  for (let index = dates.length - 1; index > 0; index--) {
    const current = new Date(`${dates[index]}T12:00:00`)
    const previous = new Date(`${dates[index - 1]}T12:00:00`)
    if ((current.getTime() - previous.getTime()) / 86_400_000 !== 1) break
    streak++
  }
  return streak
}

function buildModuleProgress(lessons: LessonProgress[]): ModuleProgress[] {
  return modules.map(module => ({ moduleId: module.id, completedLessons: lessons.filter(item => item.moduleId === module.id).length, totalLessons: module.lessons.length, updatedAt: new Date().toISOString() })).filter(item => item.completedLessons > 0)
}

async function writeLocalSnapshot(snapshot: ProgressSnapshot) {
  await db.transaction('rw', [db.progress, db.moduleProgress, db.lessonProgress, db.quizAttempts, db.labProgress, db.examAttempts, db.customQuizAttempts, db.questionBookmarks], async () => {
    await Promise.all([db.progress.clear(), db.moduleProgress.clear(), db.lessonProgress.clear(), db.quizAttempts.clear(), db.labProgress.clear(), db.examAttempts.clear(), db.customQuizAttempts.clear(), db.questionBookmarks.clear()])
    await db.progress.put(snapshot.progress)
    if (snapshot.moduleProgress.length) await db.moduleProgress.bulkPut(snapshot.moduleProgress)
    if (snapshot.lessonProgress.length) await db.lessonProgress.bulkPut(snapshot.lessonProgress)
    if (snapshot.quizAttempts.length) await db.quizAttempts.bulkAdd(snapshot.quizAttempts.map(withoutId))
    if (snapshot.labProgress.length) await db.labProgress.bulkPut(snapshot.labProgress)
    if (snapshot.examAttempts.length) await db.examAttempts.bulkAdd(snapshot.examAttempts.map(withoutId))
    if (snapshot.customQuizAttempts?.length) await db.customQuizAttempts.bulkAdd(snapshot.customQuizAttempts.map(withoutId))
    if (snapshot.questionBookmarks?.length) await db.questionBookmarks.bulkPut(snapshot.questionBookmarks)
  })
}

function uniqueBy<T>(items: T[], key: (item: T) => string) { return [...new Map(items.map(item => [key(item), item])).values()] }
function withoutId<T extends { id?: number }>(item: T): Omit<T, 'id'> { const { id: _id, ...rest } = item; void _id; return rest }
function isSnapshot(value: unknown): value is ProgressSnapshot { if (!value || typeof value !== 'object') return false; const item = value as Partial<ProgressSnapshot>; return Array.isArray(item.quizAttempts) && Array.isArray(item.labProgress) && Array.isArray(item.examAttempts) && Array.isArray(item.lessonProgress) }
