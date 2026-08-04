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

export interface LabProgress {
  labId: string
  domainId: string
  completedAt: string
}

export interface ExamAttempt {
  id?: number
  questionIds: string[]
  selectedAnswers: Record<string, number | number[]>
  score: number
  total: number
  durationSeconds: number
  mode?: 'quick' | 'full'
  completedAt: string
}

export interface CustomQuizAttempt {
  id?: number
  questionIds: string[]
  selectedAnswers: Record<string, number[]>
  score: number
  total: number
  mode: 'custom' | 'weak' | 'incorrect' | 'bookmarked'
  completedAt: string
}

export interface QuestionBookmark {
  questionId: string
  createdAt: string
}

class CcnaMasterDatabase extends Dexie {
  progress!: EntityTable<ProgressSummary, 'id'>
  moduleProgress!: EntityTable<ModuleProgress, 'moduleId'>
  lessonProgress!: EntityTable<LessonProgress, 'lessonId'>
  quizAttempts!: EntityTable<QuizAttempt, 'id'>
  labProgress!: EntityTable<LabProgress, 'labId'>
  examAttempts!: EntityTable<ExamAttempt, 'id'>
  customQuizAttempts!: EntityTable<CustomQuizAttempt, 'id'>
  questionBookmarks!: EntityTable<QuestionBookmark, 'questionId'>

  constructor() {
    super('ccna-master')
    this.version(1).stores({ progress: 'id', moduleProgress: 'moduleId, updatedAt' })
    this.version(2).stores({ progress: 'id', moduleProgress: 'moduleId, updatedAt', lessonProgress: 'lessonId, moduleId, completedAt' })
    this.version(3).stores({ progress: 'id', moduleProgress: 'moduleId, updatedAt', lessonProgress: 'lessonId, moduleId, completedAt', quizAttempts: '++id, topicId, moduleId, completedAt' })
    this.version(4).stores({ progress: 'id', moduleProgress: 'moduleId, updatedAt', lessonProgress: 'lessonId, moduleId, completedAt', quizAttempts: '++id, topicId, moduleId, completedAt', labProgress: 'labId, domainId, completedAt' })
    this.version(5).stores({ progress: 'id', moduleProgress: 'moduleId, updatedAt', lessonProgress: 'lessonId, moduleId, completedAt', quizAttempts: '++id, topicId, moduleId, completedAt', labProgress: 'labId, domainId, completedAt', examAttempts: '++id, completedAt, score' })
    this.version(6).stores({ progress: 'id', moduleProgress: 'moduleId, updatedAt', lessonProgress: 'lessonId, moduleId, completedAt', quizAttempts: '++id, topicId, moduleId, completedAt', labProgress: 'labId, domainId, completedAt', examAttempts: '++id, completedAt, score', customQuizAttempts: '++id, completedAt, mode', questionBookmarks: 'questionId, createdAt' })
  }
}

export const db = new CcnaMasterDatabase()
export const emptyProgress: ProgressSummary = { id: 'current', streakDays: 0, studyMinutes: 0, lessonsCompleted: 0, lastStudyDate: null, questionsAnswered: 0, correctAnswers: 0 }
