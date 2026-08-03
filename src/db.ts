import Dexie, { type EntityTable } from 'dexie'

export interface ProgressSummary {
  id: 'current'
  streakDays: number
  studyMinutes: number
  lessonsCompleted: number
  lastStudyDate: string | null
  questionsAnswered: number
  correctAnswers: number
}

export interface QuizAttempt {
  id?: number
  topicId: string
  moduleId: string
  score: number
  total: number
  completedAt: string
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
  quizAttempts!: EntityTable<QuizAttempt, 'id'>

  constructor() {
    super('ccna-master')
    this.version(1).stores({ progress: 'id', moduleProgress: 'moduleId, updatedAt' })
    this.version(2).stores({ progress: 'id', moduleProgress: 'moduleId, updatedAt', lessonProgress: 'lessonId, moduleId, completedAt' })
    this.version(3).stores({ progress: 'id', moduleProgress: 'moduleId, updatedAt', lessonProgress: 'lessonId, moduleId, completedAt', quizAttempts: '++id, topicId, moduleId, completedAt' })
  }
}

export const db = new CcnaMasterDatabase()
export const emptyProgress: ProgressSummary = { id: 'current', streakDays: 0, studyMinutes: 0, lessonsCompleted: 0, lastStudyDate: null, questionsAnswered: 0, correctAnswers: 0 }
