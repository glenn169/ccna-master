import { useLiveQuery } from 'dexie-react-hooks'
import { db, defaultStudyPreferences, emptyProgress, type StudyPreferences } from '../db'
import { modules } from '../data'
import { questionsByTopic } from '../questions'
import { syncCurrentUserProgress } from '../services/progressSync'

export function useProgress() {
  const savedSummary = useLiveQuery(() => db.progress.get('current'), [])
  const summary = { ...emptyProgress, ...savedSummary }
  const completedLessons = useLiveQuery(() => db.lessonProgress.toArray(), []) ?? []
  const quizAttempts = useLiveQuery(() => db.quizAttempts.toArray(), []) ?? []
  const labProgress = useLiveQuery(() => db.labProgress.toArray(), []) ?? []
  const completedLabs = labProgress.filter((item) => Boolean(item.completedAt))
  const examAttempts = useLiveQuery(() => db.examAttempts.orderBy('completedAt').reverse().toArray(), []) ?? []
  const customQuizAttempts = useLiveQuery(() => db.customQuizAttempts.orderBy('completedAt').reverse().toArray(), []) ?? []
  const questionBookmarks = useLiveQuery(() => db.questionBookmarks.toArray(), []) ?? []
  const savedPreferences = useLiveQuery(() => db.studyPreferences.get('current'), [])
  const studyPreferences = { ...defaultStudyPreferences, ...savedPreferences }
  const modulePercent = (moduleId: string) => {
    const availableTopics = modules.find((item) => item.id === moduleId)?.lessons.filter((topic) => questionsByTopic[topic.id]?.length) ?? []
    if (!availableTopics.length) return 0
    const mastered = availableTopics.filter((topic) => quizAttempts.some((attempt) => attempt.topicId === topic.id && attempt.score / attempt.total >= 0.7)).length
    return Math.round((mastered / availableTopics.length) * 100)
  }
  const isLessonComplete = (lessonId: string) => completedLessons.some((item) => item.lessonId === lessonId)
  const bestTopicScore = (topicId: string) => quizAttempts.filter((item) => item.topicId === topicId).reduce((best, item) => Math.max(best, Math.round((item.score / item.total) * 100)), 0)
  const topicAttempts = (topicId: string) => quizAttempts.filter((item) => item.topicId === topicId).length
  const isLabComplete = (labId: string) => completedLabs.some((item) => item.labId === labId)
  const labStepIndexes = (labId: string) => labProgress.find((item) => item.labId === labId)?.completedStepIndexes ?? []
  const bestExamScore = examAttempts.reduce((best, attempt) => Math.max(best, Math.round((attempt.score / attempt.total) * 100)), 0)
  return { summary, modulePercent, isLessonComplete, quizAttempts, bestTopicScore, topicAttempts, isLabComplete, labStepIndexes, completedLabs, completedLabCount: completedLabs.length, examAttempts, bestExamScore, customQuizAttempts, questionBookmarks, studyPreferences }
}

export async function saveStudyPreferences(changes: Partial<Pick<StudyPreferences, 'dailyGoalMinutes' | 'reminderEnabled' | 'reminderTime'>>) {
  const current = { ...defaultStudyPreferences, ...(await db.studyPreferences.get('current')) }
  await db.studyPreferences.put({ ...current, ...changes, id: 'current', updatedAt: new Date().toISOString() })
  void syncCurrentUserProgress()
}

export async function toggleQuestionBookmark(questionId: string) {
  const existing = await db.questionBookmarks.get(questionId)
  if (existing) await db.questionBookmarks.delete(questionId)
  else await db.questionBookmarks.put({ questionId, createdAt: new Date().toISOString() })
  void syncCurrentUserProgress()
}

export async function recordCustomQuizAttempt(questionIds: string[], selectedAnswers: Record<string, number[]>, score: number, mode: 'custom' | 'weak' | 'incorrect' | 'bookmarked') {
  await db.transaction('rw', db.customQuizAttempts, db.progress, async () => {
    const summary = { ...emptyProgress, ...(await db.progress.get('current')) }
    const today = localDate()
    const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1)
    const nextStreak = summary.lastStudyDate === today ? summary.streakDays : summary.lastStudyDate === localDate(yesterday) ? summary.streakDays + 1 : 1
    await db.customQuizAttempts.add({ questionIds, selectedAnswers, score, total: questionIds.length, mode, completedAt: new Date().toISOString() })
    await db.progress.put({ ...summary, streakDays: nextStreak, studyMinutes: summary.studyMinutes + Math.max(1, Math.ceil(questionIds.length / 2)), questionsAnswered: summary.questionsAnswered + questionIds.length, correctAnswers: summary.correctAnswers + score, lastStudyDate: today })
  })
  void syncCurrentUserProgress()
}

export async function recordExamAttempt(questionIds: string[], selectedAnswers: Record<string, number | number[]>, score: number, durationSeconds: number, mode: 'quick' | 'full' = 'quick') {
  await db.transaction('rw', db.examAttempts, db.progress, async () => {
    const summary = { ...emptyProgress, ...(await db.progress.get('current')) }
    const today = localDate()
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const nextStreak = summary.lastStudyDate === today ? summary.streakDays : summary.lastStudyDate === localDate(yesterday) ? summary.streakDays + 1 : 1
    await db.examAttempts.add({ questionIds, selectedAnswers, score, total: questionIds.length, durationSeconds, mode, completedAt: new Date().toISOString() })
    await db.progress.put({ ...summary, streakDays: nextStreak, studyMinutes: summary.studyMinutes + Math.max(1, Math.ceil(durationSeconds / 60)), questionsAnswered: summary.questionsAnswered + questionIds.length, correctAnswers: summary.correctAnswers + score, lastStudyDate: today })
  })
  void syncCurrentUserProgress()
}

export async function completeLab(labId: string, domainId: string, studyMinutes: number) {
  await db.transaction('rw', db.labProgress, db.progress, async () => {
    const existing = await db.labProgress.get(labId)
    if (existing?.completedAt) return
    const summary = { ...emptyProgress, ...(await db.progress.get('current')) }
    const today = localDate()
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const nextStreak = summary.lastStudyDate === today ? summary.streakDays : summary.lastStudyDate === localDate(yesterday) ? summary.streakDays + 1 : 1
    const now = new Date().toISOString()
    await db.labProgress.put({ ...existing, labId, domainId, completedAt: now, updatedAt: now })
    await db.progress.put({ ...summary, streakDays: nextStreak, studyMinutes: summary.studyMinutes + studyMinutes, lastStudyDate: today })
  })
  void syncCurrentUserProgress()
}

export async function saveLabSteps(labId: string, domainId: string, completedStepIndexes: number[]) {
  const existing = await db.labProgress.get(labId)
  const now = new Date().toISOString()
  await db.labProgress.put({ ...existing, labId, domainId, completedAt: existing?.completedAt ?? null, completedStepIndexes: [...new Set(completedStepIndexes)].sort((a, b) => a - b), updatedAt: now })
  void syncCurrentUserProgress()
}

export async function recordQuizAttempt(topicId: string, moduleId: string, score: number, total: number) {
  await db.transaction('rw', db.quizAttempts, db.progress, async () => {
    const summary = { ...emptyProgress, ...(await db.progress.get('current')) }
    const today = localDate()
    const yesterdayDate = new Date()
    yesterdayDate.setDate(yesterdayDate.getDate() - 1)
    const nextStreak = summary.lastStudyDate === today ? summary.streakDays : summary.lastStudyDate === localDate(yesterdayDate) ? summary.streakDays + 1 : 1
    await db.quizAttempts.add({ topicId, moduleId, score, total, completedAt: new Date().toISOString() })
    await db.progress.put({ ...summary, streakDays: nextStreak, studyMinutes: summary.studyMinutes + Math.max(1, Math.ceil(total / 2)), questionsAnswered: summary.questionsAnswered + total, correctAnswers: summary.correctAnswers + score, lastStudyDate: today })
  })
  void syncCurrentUserProgress()
}

function localDate(date = new Date()) {
  const offset = date.getTimezoneOffset() * 60_000
  return new Date(date.getTime() - offset).toISOString().slice(0, 10)
}

export async function completeLesson(lessonId: string, moduleId: string, totalLessons: number, studyMinutes: number) {
  await db.transaction('rw', db.lessonProgress, db.moduleProgress, db.progress, async () => {
    if (await db.lessonProgress.get(lessonId)) return
    const now = new Date().toISOString()
    const today = localDate()
    const summary = (await db.progress.get('current')) ?? emptyProgress
    const yesterdayDate = new Date()
    yesterdayDate.setDate(yesterdayDate.getDate() - 1)
    const nextStreak = summary.lastStudyDate === today ? summary.streakDays : summary.lastStudyDate === localDate(yesterdayDate) ? summary.streakDays + 1 : 1

    await db.lessonProgress.add({ lessonId, moduleId, completedAt: now })
    const completedInModule = await db.lessonProgress.where('moduleId').equals(moduleId).count()
    await db.moduleProgress.put({ moduleId, completedLessons: completedInModule, totalLessons, updatedAt: now })
    await db.progress.put({ ...summary, streakDays: nextStreak, studyMinutes: summary.studyMinutes + studyMinutes, lessonsCompleted: summary.lessonsCompleted + 1, lastStudyDate: today })
  })
  void syncCurrentUserProgress()
}

export function formatStudyTime(minutes: number) {
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  const remainder = minutes % 60
  return remainder ? `${hours}h ${remainder}m` : `${hours}h`
}
