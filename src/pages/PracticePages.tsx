import { ArrowLeft, ArrowRight, CheckCircle2, CircleHelp, RotateCcw, Trophy, XCircle } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { findLesson, findModule, modules } from '../data'
import { recordQuizAttempt, useProgress } from '../hooks/useProgress'
import { PageHeader } from '../components/PageHeader'
import { answerInstruction, correctAnswerIndexes, isQuestionCorrect, questionsByTopic, randomizeQuestions } from '../questions'

export function Practice() {
  const { modulePercent } = useProgress()
  return <><PageHeader eyebrow="Topic-based questions" title="Practice for CCNA 200-301" text="Choose an exam domain, then focus on one topic at a time. Every completed quiz saves your score and helps identify weak areas."/><div className="grid gap-4 md:grid-cols-2">{modules.map(({id,title,weight,description,lessons,icon:Icon,accent}) => { const available = lessons.filter((topic) => questionsByTopic[topic.id]?.length); const count = available.reduce((sum, topic) => sum + questionsByTopic[topic.id].length, 0); return <Link to={`/practice/${id}`} className="card group p-6 transition hover:-translate-y-0.5 hover:shadow-lg" key={id}><div className="flex items-start justify-between"><span className={`grid h-12 w-12 place-items-center rounded-2xl ${accent}`}><Icon/></span><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">{weight}% of exam</span></div><h2 className="mt-5 text-xl font-black text-navy-950">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-600">{description}</p><div className="mt-5 flex items-center justify-between text-xs font-bold"><span className="text-slate-500">{available.length} active topics · {count} questions</span><span className="text-cyan-600">{modulePercent(id)}% mastered</span></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-cyan-400" style={{width:`${modulePercent(id)}%`}}/></div><span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-cyan-600">View topics <ArrowRight size={17}/></span></Link>})}</div></>
}

export function PracticeModulePage() {
  const { moduleId } = useParams()
  const module = findModule(moduleId)
  const { bestTopicScore, topicAttempts } = useProgress()
  if (!module) return <Navigate to="/practice" replace/>
  return <><Link to="/practice" className="inline-flex items-center gap-2 text-sm font-bold text-slate-600"><ArrowLeft size={17}/>All domains</Link><header className="mt-5 rounded-3xl bg-navy-950 p-6 text-white sm:p-8"><p className="eyebrow">Domain {module.weight}%</p><h1 className="mt-2 text-3xl font-black sm:text-4xl">{module.title}</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">Choose a subsection below. A score of 70% or higher marks an available topic as mastered.</p></header><section className="mt-7"><h2 className="text-xl font-black text-navy-950">Topics and question sets</h2><div className="mt-4 space-y-3">{module.lessons.map((topic) => { const questions = questionsByTopic[topic.id] ?? []; const best = bestTopicScore(topic.id); const attempts = topicAttempts(topic.id); return <article className="card flex items-center gap-4 p-4 sm:p-5" key={topic.id}><span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl font-black ${best >= 70 ? 'bg-emerald-100 text-emerald-700' : questions.length ? 'bg-cyan-50 text-cyan-700' : 'bg-slate-100 text-slate-400'}`}>{best >= 70 ? <CheckCircle2 size={20}/> : topic.objective}</span><div className="min-w-0 flex-1"><h3 className="font-extrabold text-navy-950">{topic.title}</h3><p className="mt-1 text-xs font-semibold text-slate-500">{questions.length ? `${questions.length} questions · ${attempts ? `${attempts} attempt${attempts === 1 ? '' : 's'} · Best ${best}%` : 'Not attempted'}` : 'Questions coming in a future update'}</p></div>{questions.length ? <Link to={`/practice/${module.id}/${topic.id}`} className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-cyan-400 text-navy-950" aria-label={`Practice ${topic.title}`}><ArrowRight size={19}/></Link> : <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-400">Soon</span>}</article>})}</div></section></>
}

export function QuizPage() {
  const { moduleId, topicId } = useParams()
  const module = findModule(moduleId)
  const topic = findLesson(moduleId, topicId)
  const [attempt, setAttempt] = useState(0)
  const questions = useMemo(() => {
    void attempt
    return randomizeQuestions(topicId ? questionsByTopic[topicId] ?? [] : [])
  }, [topicId, attempt])
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number[]>([])
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [saving, setSaving] = useState(false)
  if (!module || !topic || !questions.length) return <Navigate to={module ? `/practice/${module.id}` : '/practice'} replace/>
  const activeModuleId = module.id
  const activeTopicId = topic.id
  const question = questions[index]
  const requiredAnswers = correctAnswerIndexes(question).length
  const answered = selected.length === requiredAnswers
  const correct = isQuestionCorrect(question, selected)
  async function next() {
    if (!answered) return
    const nextScore = score + (correct ? 1 : 0)
    if (index === questions.length - 1) { setSaving(true); await recordQuizAttempt(activeTopicId, activeModuleId, nextScore, questions.length); setScore(nextScore); setFinished(true); setSaving(false); return }
    setScore(nextScore); setIndex(index + 1); setSelected([])
  }
  function restart() { setAttempt((value) => value + 1); setIndex(0); setSelected([]); setScore(0); setFinished(false) }
  function toggleAnswer(choiceIndex: number) {
    if (answered) return
    if (requiredAnswers === 1) { setSelected([choiceIndex]); return }
    setSelected((current) => current.includes(choiceIndex) ? current.filter((value) => value !== choiceIndex) : current.length < requiredAnswers ? [...current, choiceIndex] : current)
  }
  if (finished) { const percent = Math.round((score / questions.length) * 100); return <section className="mx-auto max-w-2xl text-center"><div className="card p-7 sm:p-10"><span className={`mx-auto grid h-16 w-16 place-items-center rounded-2xl ${percent >= 70 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}><Trophy size={30}/></span><p className="eyebrow mt-5">Quiz complete</p><h1 className="mt-2 text-3xl font-black text-navy-950">{percent >= 70 ? 'Topic mastered!' : 'Good first attempt'}</h1><p className="mt-3 text-slate-600">You scored <strong>{score} out of {questions.length}</strong> ({percent}%). Your result has been saved on this device.</p><div className="mt-7 grid gap-3 sm:grid-cols-2"><button onClick={restart} className="inline-flex items-center justify-center gap-2 rounded-xl bg-navy-950 px-5 py-3 text-sm font-black text-white"><RotateCcw size={17}/>Try again</button><Link to={`/practice/${module.id}`} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 py-3 text-sm font-black">Choose another topic</Link></div></div></section> }
  const correctIndexes = correctAnswerIndexes(question)
  return <article className="mx-auto max-w-3xl"><Link to={`/practice/${module.id}`} className="inline-flex items-center gap-2 text-sm font-bold text-slate-600"><ArrowLeft size={17}/>{module.title}</Link><div className="mt-5 flex items-center justify-between text-xs font-bold text-slate-500"><span>Objective {topic.objective} · {topic.title}</span><span>{index + 1} of {questions.length}</span></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200"><div className="h-full rounded-full bg-cyan-400 transition-all" style={{width:`${((index + 1) / questions.length) * 100}%`}}/></div><section className="card mt-6 p-6 sm:p-8"><CircleHelp className="text-cyan-600"/><p className="mt-4 text-xs font-black uppercase tracking-wide text-cyan-700">{answerInstruction(question)}</p><h1 className="mt-2 text-xl font-black leading-8 text-navy-950 sm:text-2xl">{question.prompt}</h1><div className="mt-6 space-y-3">{question.choices.map((choice, choiceIndex) => { let style = selected.includes(choiceIndex) ? 'border-cyan-500 bg-cyan-50 text-navy-950' : 'border-slate-200 hover:border-cyan-400'; if (answered && correctIndexes.includes(choiceIndex)) style = 'border-emerald-500 bg-emerald-50 text-emerald-900'; else if (answered && selected.includes(choiceIndex)) style = 'border-rose-500 bg-rose-50 text-rose-900'; return <button key={choice} disabled={answered} onClick={() => toggleAnswer(choiceIndex)} className={`flex w-full items-center gap-3 rounded-xl border-2 p-4 text-left text-sm font-bold transition ${style}`}><span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-slate-100">{String.fromCharCode(65 + choiceIndex)}</span>{choice}</button>})}</div>{requiredAnswers > 1 && !answered && <p className="mt-3 text-xs font-semibold text-slate-500">Selected {selected.length} of {requiredAnswers}</p>}{answered && <div className={`mt-6 rounded-xl p-4 ${correct ? 'bg-emerald-50 text-emerald-900' : 'bg-rose-50 text-rose-900'}`}><p className="flex items-center gap-2 font-black">{correct ? <CheckCircle2 size={19}/> : <XCircle size={19}/>} {correct ? 'Correct' : 'Not quite'}</p><p className="mt-2 text-sm leading-6">{question.explanation}</p></div>}</section><button onClick={next} disabled={!answered || saving} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 font-black text-navy-950 disabled:opacity-40">{saving ? 'Saving result…' : index === questions.length - 1 ? 'Finish quiz' : 'Next question'}<ArrowRight size={18}/></button></article>
}
