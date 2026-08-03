import Dexie, { type EntityTable } from 'dexie'

export interface ProgressSummary {
  id: 'current'
  streakDays: number
  studyMinutes: number
  lessonsCompleted: number
  lastStudyDate: string | null
}

export interface ModuleProgress {
  moduleId: string
  completedLessons: number
  totalLessons: number
  updatedAt: string
}

export interface LessonProgress {
  lessonId: string
  moduleId: string
  completedAt: string
}

class CcnaMasterDatabase extends Dexie {
  progress!: EntityTable<ProgressSummary, 'id'>
  moduleProgress!: EntityTable<ModuleProgress, 'moduleId'>
  lessonProgress!: EntityTable<LessonProgress, 'lessonId'>

  constructor() {
    super('ccna-master')
    this.version(1).stores({ progress: 'id', moduleProgress: 'moduleId, updatedAt' })
    this.version(2).stores({ progress: 'id', moduleProgress: 'moduleId, updatedAt', lessonProgress: 'lessonId, moduleId, completedAt' })
  }
}

export const db = new CcnaMasterDatabase()
export const emptyProgress: ProgressSummary = { id: 'current', streakDays: 0, studyMinutes: 0, lessonsCompleted: 0, lastStudyDate: null }
