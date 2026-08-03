import { AlertTriangle, ArrowLeft, ArrowRight, CheckCircle2, Circle, ClipboardCheck, Clock3, Flag, History, RotateCcw, Trophy, XCircle } from 'lucide-react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { modules } from '../data'
import { recordExamAttempt, useProgress } from '../hooks/useProgress'
import { questionsByTopic, type PracticeQuestion } from '../questions'

type ExamQuestion = PracticeQuestion & { moduleId: string; moduleTitle: string; topicId: string; topicTitle: string }
type ExamState = 'intro' | 'active' | 'result'
const EXAM_SECONDS = 30 * 60
const PASS_PERCENT = 70

function shuffle<T>(items: T[]) {
  const result = [...items]
  for (let index = result.length - 1; index > 0; index--) {
    const swap = Math.floor(Math.random() * (index + 1))
    ;[result[index], result[swap]] = [result[swap], result[index]]
  }
  return result
}

function questionPool() {
  return modules.flatMap((module) => module.lessons.flatMap((topic) => (questionsByTopic[topic.id] ?? []).map((question) => ({ ...question, moduleId: module.id, moduleTitle: module.title, topicId: topic.id, topicTitle: topic.title }))))
}

function createExam() {
  const pool = questionPool()
  return shuffle(modules.flatMap((module) => shuffle(pool.filter((question) => question.moduleId === module.id)).slice(0, Math.round(module.weight / 5))))
}

function formatTimer(seconds: number) {
  return `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`
}

export function Exam() {
  const [state, setState] = useState<ExamState>('intro')
  const [questions, setQuestions] = useState<ExamQuestion[]>([])
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [flags, setFlags] = useState<Set<string>>(new Set())
  const [secondsLeft, setSecondsLeft] = useState(EXAM_SECONDS)
  const [saving, setSaving] = useState(false)
  const [score, setScore] = useState(0)
  const submitted = useRef(false)
  const { examAttempts, bestExamScore } = useProgress()

  async function submitExam() {
    if (submitted.current || !questions.length) return
    submitted.current = true
    setSaving(true)
    const finalScore = questions.filter((question) => answers[question.id] === question.answer).length
    await recordExamAttempt(questions.map((question) => question.id), answers, finalScore, EXAM_SECONDS - secondsLeft)
    setScore(finalScore)
    setState('result')
    setSaving(false)
  }

  useEffect(() => {
    if (state !== 'active') return
    if (secondsLeft <= 0) { void submitExam(); return }
    const timer = window.setInterval(() => setSecondsLeft((value) => value - 1), 1000)
    return () => window.clearInterval(timer)
  })

  function startExam() {
    setQuestions(createExam()); setIndex(0); setAnswers({}); setFlags(new Set()); setSecondsLeft(EXAM_SECONDS); setScore(0); submitted.current = false; setState('active')
  }

  if (state === 'intro') return <section className="mx-auto max-w-4xl"><header className="rounded-3xl bg-navy-950 p-7 text-white sm:p-10"><span className="grid h-14 w-14 place-items-center rounded-2xl bg-cyan-400 text-navy-950"><ClipboardCheck size={28}/></span><p className="eyebrow mt-6">CCNA exam mode</p><h1 className="mt-2 text-3xl font-black sm:text-5xl">20-question mock exam</h1><p className="mt-4 max-w-2xl leading-7 text-slate-300">Test all six domains under timed conditions. Questions follow the official blueprint weighting and feedback is shown only after submission.</p></header><div className="mt-6 grid gap-4 sm:grid-cols-3"><Info icon={<Clock3/>} value="30 minutes" label="Automatic submission"/><Info icon={<ClipboardCheck/>} value="20 questions" label="All six domains"/><Info icon={<Trophy/>} value="70% target" label="Pass threshold"/></div><div className="card mt-6 p-6"><h2 className="text-xl font-black text-navy-950">Before you begin</h2><ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600"><li>• Answered, unanswered and flagged questions are visible in the question navigator.</li><li>• You can move backward and forward until you submit or the timer reaches zero.</li><li>• Your score, domain breakdown and answer review are saved only on this device.</li></ul><div className="mt-6 flex flex-col gap-3 sm:flex-row"><button onClick={startExam} className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-6 py-3 font-black text-navy-950">Start mock exam <ArrowRight size={18}/></button>{examAttempts.length > 0 && <Link to="/exam/history" className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-6 py-3 font-black"><History size={18}/>History · Best {bestExamScore}%</Link>}</div></div></section>

  if (state === 'result') {
    const percent = Math.round((score / questions.length) * 100)
    return <section className="mx-auto max-w-5xl"><div className="card p-7 text-center sm:p-10"><span className={`mx-auto grid h-16 w-16 place-items-center rounded-2xl ${percent >= PASS_PERCENT ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}><Trophy size={31}/></span><p className="eyebrow mt-5">Mock exam complete</p><h1 className="mt-2 text-3xl font-black text-navy-950">{percent >= PASS_PERCENT ? 'Target achieved' : 'Keep building your score'}</h1><p className="mt-3 text-slate-600">You scored <strong>{score} out of {questions.length}</strong> ({percent}%).</p><div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row"><button onClick={startExam} className="inline-flex items-center justify-center gap-2 rounded-xl bg-navy-950 px-5 py-3 text-sm font-black text-white"><RotateCcw size={17}/>New exam</button><Link to="/exam/history" className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 py-3 text-sm font-black"><History size={17}/>Exam history</Link></div></div><DomainBreakdown questions={questions} answers={answers}/><h2 className="mt-8 text-2xl font-black text-navy-950">Answer review</h2><div className="mt-4 space-y-4">{questions.map((question, questionIndex) => { const selected = answers[question.id]; const correct = selected === question.answer; return <article className="card p-5 sm:p-6" key={question.id}><div className="flex items-start gap-3"><span className={`mt-0.5 ${correct ? 'text-emerald-600' : 'text-rose-600'}`}>{correct ? <CheckCircle2/> : <XCircle/>}</span><div><p className="text-xs font-bold text-slate-500">Question {questionIndex + 1} · {question.moduleTitle}</p><h3 className="mt-2 font-black leading-6 text-navy-950">{question.prompt}</h3><p className="mt-3 text-sm"><strong>Your answer:</strong> {selected === undefined ? 'Not answered' : question.choices[selected]}</p>{!correct && <p className="mt-1 text-sm text-emerald-800"><strong>Correct answer:</strong> {question.choices[question.answer]}</p>}<p className="mt-3 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">{question.explanation}</p></div></div></article>})}</div></section>
  }

  const question = questions[index]
  const answeredCount = Object.keys(answers).length
  return <section className="mx-auto max-w-6xl"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="eyebrow">Timed mock exam</p><h1 className="text-2xl font-black text-navy-950">Question {index + 1} of {questions.length}</h1></div><span className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 font-black ${secondsLeft < 300 ? 'bg-rose-100 text-rose-700' : 'bg-navy-950 text-white'}`}><Clock3 size={18}/>{formatTimer(secondsLeft)}</span></div><div className="mt-5 grid gap-6 lg:grid-cols-[1fr_280px]"><div><div className="card p-6 sm:p-8"><div className="flex items-center justify-between gap-4"><p className="text-xs font-bold text-slate-500">{question.moduleTitle} · {question.topicTitle}</p><button onClick={() => setFlags((current) => { const next = new Set(current); if (next.has(question.id)) next.delete(question.id); else next.add(question.id); return next })} className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-black ${flags.has(question.id) ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'}`}><Flag size={15} fill={flags.has(question.id) ? 'currentColor' : 'none'}/>{flags.has(question.id) ? 'Flagged' : 'Flag'}</button></div><h2 className="mt-5 text-xl font-black leading-8 text-navy-950 sm:text-2xl">{question.prompt}</h2><div className="mt-6 space-y-3">{question.choices.map((choice, choiceIndex) => <button key={choice} onClick={() => setAnswers((current) => ({ ...current, [question.id]: choiceIndex }))} className={`flex w-full items-center gap-3 rounded-xl border-2 p-4 text-left text-sm font-bold transition ${answers[question.id] === choiceIndex ? 'border-cyan-500 bg-cyan-50 text-navy-950' : 'border-slate-200 hover:border-cyan-400'}`}><span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-slate-100">{String.fromCharCode(65 + choiceIndex)}</span>{choice}</button>)}</div></div><div className="mt-4 flex justify-between gap-3"><button disabled={index === 0} onClick={() => setIndex((value) => value - 1)} className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-3 text-sm font-black disabled:opacity-40"><ArrowLeft size={17}/>Previous</button>{index < questions.length - 1 ? <button onClick={() => setIndex((value) => value + 1)} className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-black text-navy-950">Next <ArrowRight size={17}/></button> : <button onClick={() => void submitExam()} disabled={saving} className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-black text-white disabled:opacity-50">{saving ? 'Submitting…' : 'Submit exam'}</button>}</div></div><aside className="card h-fit p-5 lg:sticky lg:top-24"><div className="flex items-center justify-between"><h2 className="font-black text-navy-950">Navigator</h2><span className="text-xs font-bold text-slate-500">{answeredCount}/{questions.length}</span></div><div className="mt-4 grid grid-cols-5 gap-2">{questions.map((item, itemIndex) => <button key={item.id} onClick={() => setIndex(itemIndex)} aria-label={`Go to question ${itemIndex + 1}`} className={`relative grid h-10 place-items-center rounded-lg text-xs font-black ${itemIndex === index ? 'ring-2 ring-cyan-500 ring-offset-2' : ''} ${answers[item.id] !== undefined ? 'bg-cyan-100 text-cyan-800' : 'bg-slate-100 text-slate-500'}`}>{itemIndex + 1}{flags.has(item.id) && <Flag className="absolute -right-1 -top-1 text-amber-600" size={12} fill="currentColor"/>}</button>)}</div><div className="mt-5 space-y-2 text-xs font-semibold text-slate-500"><p className="flex items-center gap-2"><Circle size={12} className="fill-cyan-100 text-cyan-100"/>Answered</p><p className="flex items-center gap-2"><Flag size={12} className="text-amber-600"/>Flagged for review</p></div>{answeredCount < questions.length && <p className="mt-5 flex gap-2 rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-900"><AlertTriangle className="shrink-0" size={17}/>{questions.length - answeredCount} unanswered question{questions.length - answeredCount === 1 ? '' : 's'}.</p>}<button onClick={() => void submitExam()} disabled={saving} className="mt-5 w-full rounded-xl bg-navy-950 px-4 py-3 text-sm font-black text-white disabled:opacity-50">{saving ? 'Submitting…' : 'Submit exam'}</button></aside></div></section>
}

function Info({ icon, value, label }: { icon: ReactNode; value: string; label: string }) { return <div className="card p-5"><span className="text-cyan-600">{icon}</span><p className="mt-3 text-xl font-black text-navy-950">{value}</p><p className="text-xs font-semibold text-slate-500">{label}</p></div> }

function DomainBreakdown({ questions, answers }: { questions: ExamQuestion[]; answers: Record<string, number> }) { return <section className="mt-6"><h2 className="text-2xl font-black text-navy-950">Performance by domain</h2><div className="mt-4 grid gap-3 sm:grid-cols-2">{modules.map((module) => { const domainQuestions = questions.filter((question) => question.moduleId === module.id); const correct = domainQuestions.filter((question) => answers[question.id] === question.answer).length; const percent = Math.round((correct / domainQuestions.length) * 100); return <div className="card p-4" key={module.id}><div className="flex justify-between gap-3 text-sm"><span className="font-black text-navy-950">{module.title}</span><span className="font-bold text-slate-500">{correct}/{domainQuestions.length} · {percent}%</span></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${percent >= PASS_PERCENT ? 'bg-emerald-500' : 'bg-amber-400'}`} style={{ width: `${percent}%` }}/></div></div>})}</div></section> }

export function ExamHistory() {
  const { examAttempts, bestExamScore } = useProgress()
  return <section className="mx-auto max-w-4xl"><Link to="/exam" className="inline-flex items-center gap-2 text-sm font-bold text-slate-600"><ArrowLeft size={17}/>Exam mode</Link><header className="mt-5"><p className="eyebrow">Saved locally</p><h1 className="mt-1 text-3xl font-black text-navy-950">Mock exam history</h1><p className="mt-2 text-slate-600">Track recent results and your highest score on this device.</p></header><div className="mt-6 grid gap-4 sm:grid-cols-2"><Info icon={<Trophy/>} value={`${bestExamScore}%`} label="Best score"/><Info icon={<History/>} value={String(examAttempts.length)} label="Completed exams"/></div><div className="mt-6 space-y-3">{examAttempts.length ? examAttempts.map((attempt, index) => { const percent = Math.round((attempt.score / attempt.total) * 100); return <article className="card flex items-center gap-4 p-5" key={attempt.id}><span className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl font-black ${percent >= PASS_PERCENT ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{percent}%</span><div className="flex-1"><p className="font-black text-navy-950">{attempt.score} of {attempt.total} correct</p><p className="mt-1 text-xs font-semibold text-slate-500">{new Date(attempt.completedAt).toLocaleString()} · {formatTimer(attempt.durationSeconds)}</p></div>{index === 0 && <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-black text-cyan-700">Latest</span>}</article>}) : <div className="card p-8 text-center"><History className="mx-auto text-slate-400"/><h2 className="mt-3 font-black text-navy-950">No exam attempts yet</h2><p className="mt-1 text-sm text-slate-500">Complete a mock exam and your result will appear here.</p></div>}</div></section>
}
