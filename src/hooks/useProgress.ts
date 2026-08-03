import { useLiveQuery } from 'dexie-react-hooks'
import { db, emptyProgress } from '../db'

export function useProgress() {
  const summary = useLiveQuery(() => db.progress.get('current'), []) ?? emptyProgress
  const savedModules = useLiveQuery(() => db.moduleProgress.toArray(), []) ?? []
  const modulePercent = (moduleId: string) => {
    const saved = savedModules.find((item) => item.moduleId === moduleId)
    if (!saved || saved.totalLessons === 0) return 0
    return Math.round((saved.completedLessons / saved.totalLessons) * 100)
  }
  return { summary, modulePercent }
}

export function formatStudyTime(minutes: number) {
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  const remainder = minutes % 60
  return remainder ? `${hours}h ${remainder}m` : `${hours}h`
}
