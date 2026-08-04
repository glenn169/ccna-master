import { useEffect, useMemo, useState } from 'react'
import { Check, CheckCircle2, ChevronRight, Circle, Clock3, FlaskConical, Lightbulb, ListChecks, Router, ShieldCheck, TerminalSquare, Timer, TriangleAlert } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader'
import { NetworkTopology } from '../components/NetworkTopology'
import { modules } from '../data'
import { findLab, labs } from '../labs'
import { findLabTopology } from '../labTopologies'
import { assessmentFor } from '../labAssessments'
import { completeLab, recordLabAssessment, saveLabSteps, useProgress } from '../hooks/useProgress'

export function Labs() {
  const [domain, setDomain] = useState('all')
  const [difficulty, setDifficulty] = useState('all')
  const { isLabComplete, completedLabCount, bestLabAssessmentScore } = useProgress()
  const shown = useMemo(() => labs.filter((lab) => (domain === 'all' || lab.domainId === domain) && (difficulty === 'all' || lab.difficulty === difficulty)), [domain, difficulty])
  return <>
    <PageHeader eyebrow="Hands-on practice" title="Packet Tracer labs" text="Follow guided configuration tasks, verify your work with IOS commands, and save only the labs you actually complete." />
    <div className="mb-5 flex flex-wrap items-center gap-2">
      <button onClick={() => setDomain('all')} className={`rounded-full px-4 py-2 text-xs font-bold ${domain === 'all' ? 'bg-navy-950 text-white' : 'bg-white text-slate-600 shadow-sm'}`}>All labs</button>
      {modules.filter((item) => labs.some((lab) => lab.domainId === item.id)).map((item) => <button key={item.id} onClick={() => setDomain(item.id)} className={`rounded-full px-4 py-2 text-xs font-bold ${domain === item.id ? 'bg-navy-950 text-white' : 'bg-white text-slate-600 shadow-sm'}`}>{item.title}</button>)}
      <span className="ml-auto text-xs font-bold text-emerald-700">{completedLabCount}/{labs.length} completed</span>
    </div>
    <div className="mb-5 flex flex-wrap gap-2" aria-label="Lab difficulty filters">{['all', 'Beginner', 'Intermediate', 'Exam Challenge'].map((item) => <button key={item} onClick={() => setDifficulty(item)} className={`rounded-lg px-3 py-2 text-xs font-bold ${difficulty === item ? 'bg-cyan-100 text-cyan-800' : 'text-slate-500 hover:bg-white'}`}>{item === 'all' ? 'All difficulties' : item}</button>)}</div>
    <div className="grid gap-4 md:grid-cols-2">{shown.map((lab) => {
      const done = isLabComplete(lab.id)
      const module = modules.find((item) => item.id === lab.domainId)
      const assessmentScore = bestLabAssessmentScore(lab.id)
      return <Link to={`/labs/${lab.id}`} key={lab.id} className="card group p-5 transition hover:-translate-y-0.5 hover:shadow-lg">
        <div className="flex items-start gap-4"><span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${done ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-700'}`}>{done ? <CheckCircle2 /> : <FlaskConical />}</span><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-3"><div><p className="text-[11px] font-black uppercase tracking-wider text-cyan-600">{lab.objective} · {module?.title}</p><h2 className="mt-1 font-extrabold text-navy-950">{lab.title}</h2></div><ChevronRight className="shrink-0 text-slate-300 transition group-hover:translate-x-1" /></div><p className="mt-2 text-sm leading-5 text-slate-500">{lab.summary}</p><div className="mt-4 flex flex-wrap gap-3 text-xs font-bold text-slate-500"><span>{lab.difficulty}</span><span className="flex items-center gap-1"><Clock3 size={14}/>{lab.minutes} min</span>{assessmentScore > 0 && <span className="text-violet-700">Assessment best: {assessmentScore}%</span>}</div></div></div>
      </Link>
    })}</div>
  </>
}

export function LabPage() {
  const { labId } = useParams()
  const lab = findLab(labId)
  const { isLabComplete, labStepIndexes } = useProgress()
  const [saving, setSaving] = useState(false)
  if (!lab) return <Navigate to="/labs" replace />
  const done = isLabComplete(lab.id)
  const topology = findLabTopology(lab.id)
  const checkedSteps = labStepIndexes(lab.id)
  async function toggleStep(index: number) { const next = checkedSteps.includes(index) ? checkedSteps.filter((item) => item !== index) : [...checkedSteps, index]; await saveLabSteps(lab!.id, lab!.domainId, next) }
  async function markComplete() { setSaving(true); await saveLabSteps(lab!.id, lab!.domainId, lab!.steps.map((_, index) => index)); await completeLab(lab!.id, lab!.domainId, lab!.minutes); setSaving(false) }
  return <>
    <Link to="/labs" className="text-sm font-bold text-cyan-700">← Back to all labs</Link>
    <div className="mt-4 overflow-hidden rounded-3xl bg-navy-950 p-6 text-white sm:p-8"><p className="eyebrow">Objective {lab.objective} · {lab.difficulty}</p><h1 className="mt-2 text-3xl font-black sm:text-4xl">{lab.title}</h1><p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">{lab.summary}</p><div className="mt-5 flex flex-wrap gap-3 text-xs font-bold"><span className="rounded-full bg-white/10 px-3 py-2">{lab.minutes} minutes</span><span className="rounded-full bg-white/10 px-3 py-2">Packet Tracer</span><span className="rounded-full bg-white/10 px-3 py-2">{checkedSteps.length}/{lab.steps.length} steps saved</span></div></div>
    <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_300px]">
      <div className="space-y-5">
        <section className="card p-6"><h2 className="flex items-center gap-2 text-xl font-black"><Router className="text-cyan-600"/>Devices and preparation</h2><ul className="mt-4 grid gap-2 sm:grid-cols-2">{lab.devices.map((item) => <li key={item} className="flex gap-2 text-sm text-slate-600"><Circle className="mt-1 fill-cyan-400 text-cyan-400" size={9}/>{item}</li>)}</ul>{lab.prerequisites?.length ? <div className="mt-5 rounded-xl bg-amber-50 p-4"><p className="flex items-center gap-2 text-sm font-black text-amber-800"><ListChecks size={17}/>Before you begin</p><p className="mt-2 text-sm text-amber-800">{lab.prerequisites.join(' · ')}</p></div> : null}</section>
        {topology && <NetworkTopology topology={topology}/>}
        {lab.steps.map((step, index) => { const checked = checkedSteps.includes(index); return <section className={`card p-6 ${checked ? 'ring-2 ring-emerald-200' : ''}`} key={step.title}><div className="flex gap-4"><button aria-label={`${checked ? 'Mark incomplete' : 'Mark complete'}: ${step.title}`} onClick={() => void toggleStep(index)} className={`grid h-9 w-9 shrink-0 place-items-center rounded-full font-black ${checked ? 'bg-emerald-500 text-white' : 'bg-cyan-400 text-navy-950'}`}>{checked ? <Check size={19}/> : index + 1}</button><div className="min-w-0 flex-1"><div className="flex flex-wrap items-start justify-between gap-2"><h2 className="text-xl font-black text-navy-950">{step.title}</h2><button onClick={() => void toggleStep(index)} className="text-xs font-black text-emerald-700">{checked ? 'Completed' : 'Mark step done'}</button></div><ul className="mt-3 space-y-2">{step.instructions.map((item) => <li key={item} className="text-sm leading-6 text-slate-600">{item}</li>)}</ul>{step.commands && <div className="mt-4 overflow-x-auto rounded-xl bg-navy-950 p-4"><div className="mb-3 flex items-center gap-2 text-xs font-bold text-cyan-300"><TerminalSquare size={16}/>Cisco IOS CLI</div><pre className="text-sm leading-7 text-slate-100"><code>{step.commands.join('\n')}</code></pre></div>}</div></div></section>})}
        {lab.troubleshooting?.length ? <section className="card border border-amber-200 p-6"><h2 className="flex items-center gap-2 text-xl font-black text-navy-950"><Lightbulb className="text-amber-500"/>Troubleshooting hints</h2><ul className="mt-4 space-y-3">{lab.troubleshooting.map((item) => <li className="flex gap-2 text-sm leading-6 text-slate-600" key={item}><TriangleAlert className="mt-1 shrink-0 text-amber-500" size={16}/>{item}</li>)}</ul></section> : null}
      </div>
      <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start"><section className="card border border-violet-200 p-5"><ShieldCheck className="text-violet-600"/><h2 className="mt-3 font-black text-navy-950">Ready for the challenge?</h2><p className="mt-2 text-sm leading-6 text-slate-600">Complete this topology without revealed commands, diagnose a fault, and earn an assessment score.</p><Link to={`/labs/${lab.id}/assessment`} className="mt-4 block rounded-xl bg-violet-600 px-4 py-3 text-center text-sm font-black text-white hover:bg-violet-500">Start assessment</Link></section><section className="card p-5"><h2 className="font-black text-navy-950">Lab goals</h2><ul className="mt-4 space-y-3">{lab.goals.map((goal) => <li className="flex gap-2 text-sm text-slate-600" key={goal}><CheckCircle2 className="shrink-0 text-cyan-600" size={18}/>{goal}</li>)}</ul></section><section className="card p-5"><h2 className="font-black text-navy-950">Verification checklist</h2><ul className="mt-4 space-y-3">{lab.verify.map((item) => <li className="flex gap-2 text-sm text-slate-600" key={item}><Circle className="mt-1 shrink-0 text-emerald-500" size={14}/>{item}</li>)}</ul><div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full bg-emerald-500 transition-all" style={{width: `${Math.round((checkedSteps.length / lab.steps.length) * 100)}%`}}/></div><p className="mt-2 text-xs font-bold text-slate-500">{checkedSteps.length} of {lab.steps.length} guided steps complete</p><button disabled={done || saving} onClick={markComplete} className={`mt-4 w-full rounded-xl px-4 py-3 text-sm font-black ${done ? 'bg-emerald-100 text-emerald-700' : 'bg-cyan-400 text-navy-950 hover:bg-cyan-300'}`}>{done ? 'Lab completed' : saving ? 'Saving…' : 'Complete and save lab'}</button></section></aside>
    </div>
  </>
}

export function LabAssessmentPage() {
  const { labId } = useParams()
  const lab = findLab(labId)
  const [startedAt] = useState(Date.now())
  const [secondsLeft, setSecondsLeft] = useState(() => lab ? assessmentFor(lab).minutes * 60 : 0)
  const [checked, setChecked] = useState<number[]>([])
  const [answer, setAnswer] = useState<number | null>(null)
  const [hintsUsed, setHintsUsed] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [saved, setSaved] = useState(false)
  useEffect(() => { if (submitted || secondsLeft <= 0) return; const id = window.setInterval(() => setSecondsLeft((value) => Math.max(0, value - 1)), 1000); return () => window.clearInterval(id) }, [secondsLeft, submitted])
  if (!lab) return <Navigate to="/labs" replace />
  const assessment = assessmentFor(lab)
  const topology = findLabTopology(lab.id)
  const objectivePoints = checked.length * 2
  const diagnosisPoints = answer === assessment.fault.answer ? 4 : 0
  const total = assessment.objectives.length * 2 + 4
  const rawScore = objectivePoints + diagnosisPoints
  const score = Math.max(0, rawScore - hintsUsed)
  const expired = secondsLeft === 0
  async function submit() { if (submitted) return; setSubmitted(true); const duration = Math.max(1, Math.round((Date.now() - startedAt) / 1000)); await recordLabAssessment(lab!.id, lab!.domainId, score, total, hintsUsed, duration); setSaved(true) }
  return <>
    <Link to={`/labs/${lab.id}`} className="text-sm font-bold text-cyan-700">← Back to guided lab</Link>
    <div className="mt-4 rounded-3xl bg-violet-950 p-6 text-white sm:p-8"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="eyebrow">Timed lab assessment · Objective {lab.objective}</p><h1 className="mt-2 text-3xl font-black">{lab.title}</h1><p className="mt-3 max-w-3xl text-sm leading-6 text-violet-100">{assessment.scenario}</p></div><div className={`flex items-center gap-2 rounded-xl px-4 py-3 font-black ${secondsLeft < 300 ? 'bg-red-500' : 'bg-white/10'}`}><Timer size={20}/>{Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, '0')}</div></div></div>
    <div className="mt-6 space-y-5">
      {topology && <NetworkTopology topology={topology}/>}
      <section className="card p-6"><h2 className="text-xl font-black text-navy-950">Configuration objectives</h2><p className="mt-2 text-sm text-slate-600">Configure the topology in Packet Tracer. Check an objective only after verifying it yourself.</p><div className="mt-4 space-y-3">{assessment.objectives.map((item, index) => <label key={item} className="flex cursor-pointer gap-3 rounded-xl border border-slate-200 p-4"><input type="checkbox" disabled={submitted} checked={checked.includes(index)} onChange={() => setChecked((items) => items.includes(index) ? items.filter((value) => value !== index) : [...items, index])}/><span className="text-sm font-bold text-slate-700">{item}</span></label>)}</div></section>
      <section className="card border border-amber-200 p-6"><h2 className="flex items-center gap-2 text-xl font-black text-navy-950"><TriangleAlert className="text-amber-500"/>Troubleshooting challenge</h2><ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-600">{assessment.fault.evidence.map((item) => <li key={item}>{item}</li>)}</ul><p className="mt-5 font-black text-navy-950">{assessment.fault.question}</p><div className="mt-3 grid gap-2 sm:grid-cols-2">{assessment.fault.options.map((option, index) => <button disabled={submitted} onClick={() => setAnswer(index)} key={option} className={`rounded-xl border p-3 text-left text-sm font-bold ${answer === index ? 'border-cyan-500 bg-cyan-50 text-cyan-900' : 'border-slate-200 text-slate-600'}`}>{option}</button>)}</div></section>
      <section className="card p-6"><div className="flex items-center justify-between"><div><h2 className="text-xl font-black text-navy-950">Progressive hints</h2><p className="mt-1 text-sm text-slate-500">Each revealed hint deducts one point.</p></div>{!submitted && hintsUsed < assessment.hints.length && <button onClick={() => setHintsUsed((value) => value + 1)} className="rounded-xl bg-amber-100 px-4 py-2 text-sm font-black text-amber-800">Reveal hint</button>}</div><ol className="mt-4 space-y-3">{assessment.hints.slice(0, submitted ? assessment.hints.length : hintsUsed).map((hint, index) => <li className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900" key={hint}><b>Hint {index + 1}:</b> {hint}</li>)}</ol></section>
      {submitted && <section className="card border-2 border-emerald-300 p-6"><p className="eyebrow">Assessment result</p><h2 className="mt-2 text-3xl font-black text-navy-950">{score}/{total} points · {Math.round(score / total * 100)}%</h2><p className="mt-2 text-sm text-slate-600">{saved ? 'Result saved offline and queued for cross-device synchronization.' : 'Saving result…'}</p><div className="mt-5 rounded-xl bg-slate-50 p-4"><h3 className="font-black text-navy-950">Diagnosis explanation</h3><p className="mt-2 text-sm leading-6 text-slate-600">{assessment.fault.explanation}</p></div><div className="mt-5"><h3 className="font-black text-navy-950">Expected success criteria</h3><ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-600">{assessment.successCriteria.map((item) => <li key={item}>{item}</li>)}</ul></div><div className="mt-5 overflow-x-auto rounded-xl bg-navy-950 p-4"><div className="mb-3 flex items-center gap-2 text-xs font-bold text-cyan-300"><TerminalSquare size={16}/>Solution commands</div><pre className="text-sm leading-7 text-slate-100"><code>{lab.steps.flatMap((step) => step.commands ?? []).join('\n') || 'Use the guided lab steps to review the complete configuration.'}</code></pre></div></section>}
      {!submitted && <button disabled={!expired && (answer === null || checked.length === 0)} onClick={() => void submit()} className="w-full rounded-xl bg-violet-600 px-5 py-4 font-black text-white disabled:cursor-not-allowed disabled:opacity-50">{expired ? 'Time expired — submit assessment' : 'Submit assessment'}</button>}
    </div>
  </>
}
