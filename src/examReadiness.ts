import type { ExamAttempt } from './db'
import { modules } from './data'
import { questionsByTopic, type PracticeQuestion } from './questions'

type LocatedQuestion = PracticeQuestion & { moduleId: string }

const locatedQuestions = new Map<string, LocatedQuestion>(
  modules.flatMap((module) => module.lessons.flatMap((topic) =>
    (questionsByTopic[topic.id] ?? []).map((question) => [question.id, { ...question, moduleId: module.id }] as const),
  )),
)

export type ReadinessDomain = {
  id: string
  title: string
  weight: number
  answered: number
  accuracy: number
}

export function calculateExamReadiness(attempts: ExamAttempt[]) {
  const recent = attempts.slice(0, 5)
  const domains: ReadinessDomain[] = modules.map((module) => {
    let answered = 0
    let correct = 0
    for (const attempt of recent) {
      for (const questionId of attempt.questionIds) {
        const question = locatedQuestions.get(questionId)
        if (question?.moduleId !== module.id) continue
        answered += 1
        const selected = attempt.selectedAnswers[questionId]
        const expected = Array.isArray(question.answer) ? question.answer : [question.answer]
        const actual = Array.isArray(selected) ? selected : selected === undefined ? [] : [selected]
        if (actual.length === expected.length && [...actual].sort().every((value, index) => value === [...expected].sort()[index])) correct += 1
      }
    }
    return { id: module.id, title: module.title, weight: module.weight, answered, accuracy: answered ? Math.round(correct / answered * 100) : 0 }
  })
  const weightedAccuracy = Math.round(domains.reduce((total, domain) => total + domain.accuracy * domain.weight / 100, 0))
  const evidence = Math.min(100, Math.round(domains.reduce((total, domain) => total + domain.answered, 0) / 2))
  const score = Math.round(weightedAccuracy * (0.75 + evidence * 0.0025))
  const level = evidence < 40 ? 'Building evidence' : score >= 85 ? 'Exam ready' : score >= 75 ? 'Nearly ready' : 'More practice needed'
  return { score, level, evidence, domains }
}
