import { Activity, ArrowRight, BookOpenCheck, CheckCircle2, CircleAlert, Clock3, Flame, Target, TrendingUp, Trophy } from 'lucide-react'
import { Link } from 'react-router-dom'
import { modules } from '../data'
import { labs } from '../labs'
import { questionsByTopic } from '../questions'
import { PageHeader } from '../components/PageHeader'
import { formatStudyTime, useProgress } from '../hooks/useProgress'
import type { ExamAttempt, LabProgress, QuizAttempt } from '../db'

export function Progress() {
  const { modulePercent, summary, quizAttempts, completedLabs, examAttempts, bestExamScore } = useProgress()
  const accuracy = summary.questionsAnswered ? Math.round((summary.correctAnswers / summary.questionsAnswered) * 100) : 0
  const domainStats = buildDomainStats(quizAttempts, examAttempts, modulePercent)
  const recommendations = buildRecommendations(quizAttempts)
  const recentActivity = buildRecentActivity(quizAttempts, completedLabs, examAttempts)
  const examTrend = [...examAttempts].reverse().slice(-8).map((attempt) => Math.round((attempt.score / attempt.total) * 100))

  return <>
    <PageHeader eyebrow="Your performance" title="Progress analytics" text="Turn your synchronized practice, lab and mock-exam results into a focused CCNA study plan."/>
    <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      <Metric icon={<Target size={19}/>} value={summary.questionsAnswered.toString()} label="Questions answered" tone="bg-cyan-50 text-cyan-700"/>
      <Metric icon={<TrendingUp size={19}/>} value={`${accuracy}%`} label="Overall accuracy" tone="bg-violet-50 text-violet-700"/>
      <Metric icon={<Clock3 size={19}/>} value={formatStudyTime(summary.studyMinutes)} label="Study time" tone="bg-blue-50 text-blue-700"/>
      <Metric icon={<Flame size={19}/>} value={`${summary.streakDays} day${summary.streakDays === 1 ? '' : 's'}`} label="Current streak" tone="bg-amber-50 text-amber-700"/>
    </section>

    <div className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
      <section className="card p-5 sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-2"><div><p className="eyebrow">Blueprint coverage</p><h2 className="mt-1 text-xl font-black text-navy-950">Performance by domain</h2></div><p className="text-xs font-bold text-slate-500">Accuracy · topic mastery</p></div>
        <div className="mt-6 space-y-5">{domainStats.map((item) => <div key={item.id}><div className="flex items-center justify-between gap-3 text-sm"><span className="font-extrabold text-navy-950">{item.title}</span><span className="shrink-0 font-bold text-slate-500">{item.answered ? `${item.accuracy}%` : 'No answers'} · {item.mastery}%</span></div><div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${item.accuracy >= 70 ? 'bg-emerald-500' : item.answered ? 'bg-amber-400' : 'bg-slate-300'}`} style={{width:`${item.answered ? Math.max(item.accuracy, 3) : 0}%`}}/></div><p className="mt-1 text-xs font-semibold text-slate-400">{item.answered} question{item.answered === 1 ? '' : 's'} answered</p></div>)}</div>
      </section>

      <section className="card p-5 sm:p-6">
        <p className="eyebrow">Mock exams</p><div className="mt-1 flex items-start justify-between gap-4"><div><h2 className="text-xl font-black text-navy-950">Score trend</h2><p className="mt-1 text-sm text-slate-500">Your last {examTrend.length || 0} attempt{examTrend.length === 1 ? '' : 's'}</p></div><span className="rounded-xl bg-amber-50 p-3 text-amber-600"><Trophy size={22}/></span></div>
        {examTrend.length ? <><Trend values={examTrend}/><div className="mt-4 flex justify-between text-sm font-bold"><span className="text-slate-500">Latest {examTrend[examTrend.length - 1]}%</span><span className="text-navy-950">Best {bestExamScore}%</span></div></> : <EmptyState text="Complete a mock exam to start your score trend." to="/exam" action="Start exam"/>}
      </section>
    </div>

    <div className="mt-6 grid gap-6 lg:grid-cols-2">
      <section className="card p-5 sm:p-6"><div className="flex items-center gap-3"><span className="rounded-xl bg-rose-50 p-3 text-rose-600"><CircleAlert size={22}/></span><div><p className="eyebrow">Focused study</p><h2 className="text-xl font-black text-navy-950">Recommended next</h2></div></div>{recommendations.length ? <div className="mt-5 space-y-3">{recommendations.map((item) => <Link key={item.topicId} to={`/practice/${item.moduleId}/${item.topicId}`} className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-cyan-400"><span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl font-black ${item.score < 70 ? 'bg-rose-50 text-rose-700' : 'bg-cyan-50 text-cyan-700'}`}>{item.objective}</span><span className="min-w-0 flex-1"><span className="block font-extrabold text-navy-950">{item.title}</span><span className="mt-1 block text-xs font-semibold text-slate-500">{item.attempts ? `Best score ${item.score}% · Review this weak area` : 'Not attempted · Build your coverage'}</span></span><ArrowRight className="shrink-0 text-cyan-600" size={18}/></Link>)}</div> : <EmptyState text="Practice a topic to receive personalized recommendations." to="/practice" action="Choose a topic"/>}</section>

      <section className="card p-5 sm:p-6"><div className="flex items-center gap-3"><span className="rounded-xl bg-emerald-50 p-3 text-emerald-600"><Activity size={22}/></span><div><p className="eyebrow">Timeline</p><h2 className="text-xl font-black text-navy-950">Recent activity</h2></div></div>{recentActivity.length ? <div className="mt-5 divide-y divide-slate-100">{recentActivity.map((item) => <div className="flex items-center gap-3 py-3" key={item.key}><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-600">{item.icon}</span><div className="min-w-0 flex-1"><p className="truncate text-sm font-extrabold text-navy-950">{item.title}</p><p className="mt-0.5 text-xs font-semibold text-slate-500">{item.detail}</p></div><time className="shrink-0 text-xs font-bold text-slate-400">{formatDate(item.date)}</time></div>)}</div> : <EmptyState text="Your completed quizzes, labs and exams will appear here." to="/practice" action="Start practice"/>}</section>
    </div>

    <div className="mt-6 flex items-center gap-3 rounded-xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-800"><CheckCircle2 className="shrink-0"/>These analytics use your offline progress and synchronize with your account across devices.</div>
  </>
}

function Metric({ icon, value, label, tone }: { icon: React.ReactNode; value: string; label: string; tone: string }) { return <div className="card p-4 sm:p-5"><span className={`grid h-10 w-10 place-items-center rounded-xl ${tone}`}>{icon}</span><p className="mt-4 text-2xl font-black text-navy-950">{value}</p><p className="mt-1 text-xs font-semibold text-slate-500">{label}</p></div> }

function Trend({ values }: { values: number[] }) { const points = values.map((value, index) => `${values.length === 1 ? 50 : (index / (values.length - 1)) * 100},${100 - value}`).join(' '); return <div className="mt-6 h-36 rounded-xl bg-slate-50 p-3"><svg viewBox="0 0 100 100" className="h-full w-full overflow-visible" role="img" aria-label={`Mock exam score trend: ${values.join(', ')} percent`} preserveAspectRatio="none"><line x1="0" y1="30" x2="100" y2="30" stroke="#bbf7d0" strokeWidth="1" strokeDasharray="3 3"/><polyline points={points} fill="none" stroke="#06b6d4" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke"/>{values.map((value, index) => <circle key={`${index}-${value}`} cx={values.length === 1 ? 50 : (index / (values.length - 1)) * 100} cy={100-value} r="2.2" fill="#083344" vectorEffect="non-scaling-stroke"/>)}</svg></div> }

function EmptyState({ text, to, action }: { text: string; to: string; action: string }) { return <div className="mt-6 rounded-xl bg-slate-50 p-5 text-center"><p className="text-sm font-semibold text-slate-500">{text}</p><Link to={to} className="mt-3 inline-flex items-center gap-2 text-sm font-black text-cyan-600">{action}<ArrowRight size={16}/></Link></div> }

function buildDomainStats(quizAttempts: QuizAttempt[], examAttempts: ExamAttempt[], mastery: (moduleId: string) => number) {
  const questionModule = new Map<string, string>()
  for (const module of modules) for (const topic of module.lessons) for (const question of questionsByTopic[topic.id] ?? []) questionModule.set(question.id, module.id)
  return modules.map((module) => {
    let answered = 0; let correct = 0
    quizAttempts.filter((attempt) => attempt.moduleId === module.id).forEach((attempt) => { answered += attempt.total; correct += attempt.score })
    examAttempts.forEach((attempt) => attempt.questionIds.forEach((questionId) => { if (questionModule.get(questionId) !== module.id) return; answered++; const question = Object.values(questionsByTopic).flat().find((item) => item.id === questionId); if (question && attempt.selectedAnswers[questionId] === question.answer) correct++ }))
    return { id: module.id, title: module.title, answered, accuracy: answered ? Math.round((correct / answered) * 100) : 0, mastery: mastery(module.id) }
  })
}

function buildRecommendations(attempts: QuizAttempt[]) {
  const candidates = modules.flatMap((module) => module.lessons.map((topic) => { const topicAttempts = attempts.filter((attempt) => attempt.topicId === topic.id); const score = topicAttempts.reduce((best, attempt) => Math.max(best, Math.round((attempt.score / attempt.total) * 100)), 0); return { topicId: topic.id, moduleId: module.id, title: topic.title, objective: topic.objective, attempts: topicAttempts.length, score } }))
  const weak = candidates.filter((item) => item.attempts && item.score < 70).sort((a, b) => a.score - b.score)
  const newTopics = candidates.filter((item) => !item.attempts)
  return [...weak, ...newTopics].slice(0, 3)
}

function buildRecentActivity(quizzes: QuizAttempt[], completedLabs: LabProgress[], exams: ExamAttempt[]) {
  return [
    ...quizzes.map((item) => { const topic = modules.flatMap((module) => module.lessons).find((candidate) => candidate.id === item.topicId); return { key: `quiz-${item.id}-${item.completedAt}`, date: item.completedAt, title: topic?.title ?? 'Topic practice', detail: `Quiz · ${Math.round((item.score / item.total) * 100)}%`, icon: <BookOpenCheck size={18}/> } }),
    ...completedLabs.map((item) => ({ key: `lab-${item.labId}`, date: item.completedAt, title: labs.find((lab) => lab.id === item.labId)?.title ?? 'Packet Tracer lab', detail: 'Lab completed', icon: <CheckCircle2 size={18}/> })),
    ...exams.map((item) => ({ key: `exam-${item.id}-${item.completedAt}`, date: item.completedAt, title: '20-question mock exam', detail: `Exam · ${Math.round((item.score / item.total) * 100)}%`, icon: <Trophy size={18}/> })),
  ].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6)
}

function formatDate(value: string) { const date = new Date(value); const today = new Date(); if (date.toDateString() === today.toDateString()) return 'Today'; return new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'short' }).format(date) }

export function NotFound() { return <div className="grid min-h-[60vh] place-items-center text-center"><div><p className="text-7xl font-black text-cyan-400">404</p><h1 className="mt-3 text-2xl font-black">Page not found</h1><a href="/ccna-master/" className="mt-5 inline-block font-bold text-cyan-600">Return to dashboard</a></div></div> }
