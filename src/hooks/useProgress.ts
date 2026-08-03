import { useLiveQuery } from 'dexie-react-hooks'
import { db, emptyProgress } from '../db'

export function useProgress() {
  const summary = useLiveQuery(() => db.progress.get('current'), []) ?? emptyProgress
  const savedModules = useLiveQuery(() => db.moduleProgress.toArray(), []) ?? []
  const completedLessons = useLiveQuery(() => db.lessonProgress.toArray(), []) ?? []
  const modulePercent = (moduleId: string) => {
    const saved = savedModules.find((item) => item.moduleId === moduleId)
    if (!saved || saved.totalLessons === 0) return 0
    return Math.round((saved.completedLessons / saved.totalLessons) * 100)
  }
  const isLessonComplete = (lessonId: string) => completedLessons.some((item) => item.lessonId === lessonId)
  return { summary, modulePercent, isLessonComplete }
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
