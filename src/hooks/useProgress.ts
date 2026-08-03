import { useLiveQuery } from 'dexie-react-hooks'
import { db, emptyProgress } from '../db'
import { modules } from '../data'
import { questionsByTopic } from '../questions'

export function useProgress() {
  const savedSummary = useLiveQuery(() => db.progress.get('current'), [])
  const summary = { ...emptyProgress, ...savedSummary }
  const completedLessons = useLiveQuery(() => db.lessonProgress.toArray(), []) ?? []
  const quizAttempts = useLiveQuery(() => db.quizAttempts.toArray(), []) ?? []
  const modulePercent = (moduleId: string) => {
    const availableTopics = modules.find((item) => item.id === moduleId)?.lessons.filter((topic) => questionsByTopic[topic.id]?.length) ?? []
    if (!availableTopics.length) return 0
    const mastered = availableTopics.filter((topic) => quizAttempts.some((attempt) => attempt.topicId === topic.id && attempt.score / attempt.total >= 0.7)).length
    return Math.round((mastered / availableTopics.length) * 100)
  }
  const isLessonComplete = (lessonId: string) => completedLessons.some((item) => item.lessonId === lessonId)
  const bestTopicScore = (topicId: string) => quizAttempts.filter((item) => item.topicId === topicId).reduce((best, item) => Math.max(best, Math.round((item.score / item.total) * 100)), 0)
  const topicAttempts = (topicId: string) => quizAttempts.filter((item) => item.topicId === topicId).length
  return { summary, modulePercent, isLessonComplete, quizAttempts, bestTopicScore, topicAttempts }
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
}

export function formatStudyTime(minutes: number) {
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  const remainder = minutes % 60
  return remainder ? `${hours}h ${remainder}m` : `${hours}h`
}
