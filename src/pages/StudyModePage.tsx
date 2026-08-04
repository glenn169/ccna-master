import { Bookmark, CheckCircle2, CircleHelp, RotateCcw, SlidersHorizontal, Sparkles, Target, XCircle } from 'lucide-react'
import { useMemo, useState } from 'react'
import { modules } from '../data'
import { answerInstruction, correctAnswerIndexes, isQuestionCorrect, questionsByTopic, type PracticeQuestion } from '../questions'
import { recordCustomQuizAttempt, toggleQuestionBookmark, useProgress } from '../hooks/useProgress'
import { PageHeader } from '../components/PageHeader'

type StudyQuestion = PracticeQuestion & { moduleId: string; moduleTitle: string; topicId: string; topicTitle: string }
type StudyMode = 'custom' | 'weak' | 'incorrect' | 'bookmarked'
type StudyState = 'setup' | 'active' | 'result'

const allQuestions: StudyQuestion[] = modules.flatMap((module) => module.lessons.flatMap((topic) => (questionsByTopic[topic.id] ?? []).map((question) => ({ ...question, moduleId: module.id, moduleTitle: module.title, topicId: topic.id, topicTitle: topic.title }))))

function shuffle<T>(items: T[]) { const result = [...items]; for (let index = result.length - 1; index > 0; index--) { const swap = Math.floor(Math.random() * (index + 1)); [result[index], result[swap]] = [result[swap], result[index]] } return result }

export function StudyModePage() {
  const { quizAttempts, examAttempts, customQuizAttempts, questionBookmarks } = useProgress()
  const [state, setState] = useState<StudyState>('setup')
  const [mode, setMode] = useState<StudyMode>('custom')
  const [domainId, setDomainId] = useState('all')
  const [topicId, setTopicId] = useState('all')
  const [difficulty, setDifficulty] = useState('all')
  const [count, setCount] = useState(10)
  const [questions, setQuestions] = useState<StudyQuestion[]>([])
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number[]>>({})
  const [score, setScore] = useState(0)
  const [saving, setSaving] = useState(false)
  const bookmarkedIds = useMemo(() => new Set(questionBookmarks.map((item) => item.questionId)), [questionBookmarks])
  const recentIds = useMemo(() => new Set(customQuizAttempts.slice(0, 3).flatMap((item) => item.questionIds)), [customQuizAttempts])

  const weakTopicIds = useMemo(() => {
    const scores = modules.flatMap((module) => module.lessons.map((topic) => { const attempts = quizAttempts.filter((item) => item.topicId === topic.id); return { id: topic.id, attempts: attempts.length, score: attempts.reduce((best, item) => Math.max(best, item.score / item.total), 0) } }))
    return new Set(scores.filter((item) => item.attempts && item.score < .7).sort((a, b) => a.score - b.score).slice(0, 8).map((item) => item.id))
  }, [quizAttempts])
  const incorrectIds = useMemo(() => {
    const ids = new Set<string>()
    ;[...examAttempts, ...customQuizAttempts].forEach((attempt) => attempt.questionIds.forEach((id) => { const question = allQuestions.find((item) => item.id === id); if (question && !isQuestionCorrect(question, attempt.selectedAnswers[id])) ids.add(id) }))
    return ids
  }, [examAttempts, customQuizAttempts])

  const availableTopics = domainId === 'all' ? modules.flatMap((module) => module.lessons) : modules.find((module) => module.id === domainId)?.lessons ?? []
  function poolFor(selectedMode: StudyMode) {
    let pool = allQuestions
    if (selectedMode === 'weak') pool = pool.filter((item) => weakTopicIds.has(item.topicId))
    if (selectedMode === 'incorrect') pool = pool.filter((item) => incorrectIds.has(item.id))
    if (selectedMode === 'bookmarked') pool = pool.filter((item) => bookmarkedIds.has(item.id))
    if (selectedMode === 'custom') {
      if (domainId !== 'all') pool = pool.filter((item) => item.moduleId === domainId)
      if (topicId !== 'all') pool = pool.filter((item) => item.topicId === topicId)
      if (difficulty !== 'all') pool = pool.filter((item) => (item.difficulty ?? 'medium') === difficulty)
    }
    return [...shuffle(pool.filter((item) => !recentIds.has(item.id))), ...shuffle(pool.filter((item) => recentIds.has(item.id)))]
  }
  function start(selectedMode = mode) { const pool = poolFor(selectedMode); if (!pool.length) return; setMode(selectedMode); setQuestions(pool.slice(0, Math.min(count, pool.length))); setIndex(0); setAnswers({}); setScore(0); setState('active') }
  function toggle(choiceIndex: number) { const question = questions[index]; const required = correctAnswerIndexes(question).length; const selected = answers[question.id] ?? []; const next = required === 1 ? [choiceIndex] : selected.includes(choiceIndex) ? selected.filter((item) => item !== choiceIndex) : selected.length < required ? [...selected, choiceIndex] : selected; setAnswers((current) => ({ ...current, [question.id]: next })) }
  async function next() { const question = questions[index]; const selected = answers[question.id]; if (!selected || selected.length !== correctAnswerIndexes(question).length) return; const nextScore = score + (isQuestionCorrect(question, selected) ? 1 : 0); if (index < questions.length - 1) { setScore(nextScore); setIndex(index + 1); return } setSaving(true); await recordCustomQuizAttempt(questions.map((item) => item.id), answers, nextScore, mode); setScore(nextScore); setSaving(false); setState('result') }

  if (state === 'setup') return <><PageHeader eyebrow="Personalized practice" title="Study Mode" text="Build a custom quiz or let your synchronized results choose the questions that need the most attention."/><section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"><Mode icon={<SlidersHorizontal/>} title="Custom quiz" text="Filter by domain, topic, difficulty and length." available={allQuestions.length} onClick={() => { setMode('custom'); document.getElementById('builder')?.scrollIntoView({behavior:'smooth'}) }}/><Mode icon={<Target/>} title="Weak areas" text="Practice topics currently below 70%." available={allQuestions.filter((item) => weakTopicIds.has(item.topicId)).length} onClick={() => start('weak')}/><Mode icon={<RotateCcw/>} title="Retry incorrect" text="Retry questions missed in exams and custom quizzes." available={incorrectIds.size} onClick={() => start('incorrect')}/><Mode icon={<Bookmark/>} title="Bookmarks" text="Review questions you saved for later." available={bookmarkedIds.size} onClick={() => start('bookmarked')}/></section><section id="builder" className="card mt-6 p-5 sm:p-7"><div className="flex items-center gap-3"><span className="rounded-xl bg-cyan-50 p-3 text-cyan-700"><Sparkles/></span><div><p className="eyebrow">Quiz builder</p><h2 className="text-xl font-black text-navy-950">Choose your focus</h2></div></div><div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><Select label="Domain" value={domainId} onChange={(value) => {setDomainId(value); setTopicId('all')}} options={[['all','All domains'], ...modules.map((item) => [item.id,item.title])]}/><Select label="Topic" value={topicId} onChange={setTopicId} options={[['all','All topics'], ...availableTopics.map((item) => [item.id,`${item.objective} ${item.title}`])]}/><Select label="Difficulty" value={difficulty} onChange={setDifficulty} options={[['all','All difficulties'],['easy','Easy'],['medium','Medium'],['hard','Hard']]}/><Select label="Questions" value={String(count)} onChange={(value) => setCount(Number(value))} options={[[5,'5'],[10,'10'],[20,'20'],[30,'30']].map(([value,label]) => [String(value),String(label)])}/></div><button onClick={() => start('custom')} disabled={!poolFor('custom').length} className="mt-6 w-full rounded-xl bg-cyan-400 px-5 py-3 font-black text-navy-950 disabled:opacity-40">Start custom quiz · {Math.min(count, poolFor('custom').length)} questions</button></section></>

  if (state === 'result') { const percent = Math.round((score / questions.length) * 100); return <section className="mx-auto max-w-2xl text-center"><div className="card p-8"><CheckCircle2 className="mx-auto text-emerald-600" size={54}/><p className="eyebrow mt-5">Study session complete</p><h1 className="mt-2 text-3xl font-black text-navy-950">{score}/{questions.length} correct · {percent}%</h1><p className="mt-3 text-slate-600">This result and your bookmarks are saved offline and synchronized with your account.</p><div className="mt-6 grid gap-3 sm:grid-cols-2"><button onClick={() => start(mode)} className="rounded-xl bg-navy-950 px-5 py-3 font-black text-white">New set</button><button onClick={() => setState('setup')} className="rounded-xl border border-slate-300 px-5 py-3 font-black">Change settings</button></div></div></section> }

  const question = questions[index]; const selected = answers[question.id] ?? []; const required = correctAnswerIndexes(question).length; const answered = selected.length === required; const correct = answered && isQuestionCorrect(question, selected)
  return <article className="mx-auto max-w-3xl"><div className="flex items-center justify-between text-xs font-bold text-slate-500"><span>{question.moduleTitle} · {question.topicTitle}</span><span>{index + 1} of {questions.length}</span></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200"><div className="h-full bg-cyan-400" style={{width:`${((index+1)/questions.length)*100}%`}}/></div><section className="card mt-6 p-6 sm:p-8"><div className="flex justify-between gap-4"><CircleHelp className="text-cyan-600"/><button onClick={() => void toggleQuestionBookmark(question.id)} className={`rounded-lg p-2 ${bookmarkedIds.has(question.id) ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'}`} aria-label="Bookmark question"><Bookmark size={19} fill={bookmarkedIds.has(question.id) ? 'currentColor' : 'none'}/></button></div><p className="mt-4 text-xs font-black uppercase tracking-wide text-cyan-700">{answerInstruction(question)} · {question.difficulty ?? 'medium'}</p><h1 className="mt-2 text-xl font-black leading-8 text-navy-950 sm:text-2xl">{question.prompt}</h1><div className="mt-6 space-y-3">{question.choices.map((choice, choiceIndex) => { let style=selected.includes(choiceIndex)?'border-cyan-500 bg-cyan-50':'border-slate-200'; if(answered&&correctAnswerIndexes(question).includes(choiceIndex))style='border-emerald-500 bg-emerald-50'; else if(answered&&selected.includes(choiceIndex))style='border-rose-500 bg-rose-50'; return <button key={choice} disabled={answered} onClick={() => toggle(choiceIndex)} className={`flex w-full gap-3 rounded-xl border-2 p-4 text-left text-sm font-bold ${style}`}><span>{String.fromCharCode(65+choiceIndex)}.</span>{choice}</button>})}</div>{required>1&&!answered&&<p className="mt-3 text-xs font-semibold text-slate-500">Selected {selected.length} of {required}</p>}{answered&&<div className={`mt-6 rounded-xl p-4 ${correct?'bg-emerald-50 text-emerald-900':'bg-rose-50 text-rose-900'}`}><p className="flex items-center gap-2 font-black">{correct?<CheckCircle2 size={18}/>:<XCircle size={18}/>} {correct?'Correct':'Not quite'}</p><p className="mt-2 text-sm leading-6">{question.explanation}</p></div>}</section><button onClick={() => void next()} disabled={!answered||saving} className="mt-5 w-full rounded-xl bg-cyan-400 px-5 py-3 font-black text-navy-950 disabled:opacity-40">{saving?'Saving…':index===questions.length-1?'Finish quiz':'Next question'}</button></article>
}

function Mode({icon,title,text,available,onClick}:{icon:React.ReactNode;title:string;text:string;available:number;onClick:()=>void}) { return <button onClick={onClick} disabled={!available} className="card p-5 text-left transition hover:-translate-y-0.5 disabled:opacity-50"><span className="grid h-11 w-11 place-items-center rounded-xl bg-cyan-50 text-cyan-700">{icon}</span><h2 className="mt-4 font-black text-navy-950">{title}</h2><p className="mt-2 text-sm leading-5 text-slate-500">{text}</p><p className="mt-4 text-xs font-black text-cyan-700">{available} available</p></button> }
function Select({label,value,onChange,options}:{label:string;value:string;onChange:(value:string)=>void;options:string[][]}) { return <label className="text-sm font-bold text-slate-600">{label}<select value={value} onChange={(event)=>onChange(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 bg-white p-3 text-sm font-semibold text-navy-950">{options.map(([optionValue,optionLabel])=><option key={optionValue} value={optionValue}>{optionLabel}</option>)}</select></label> }
