import { useMemo, useState } from 'react'
import { Check, CheckCircle2, ChevronRight, Circle, Clock3, FlaskConical, Lightbulb, ListChecks, Router, TerminalSquare, TriangleAlert } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader'
import { NetworkTopology } from '../components/NetworkTopology'
import { modules } from '../data'
import { findLab, labs } from '../labs'
import { findLabTopology } from '../labTopologies'
import { completeLab, saveLabSteps, useProgress } from '../hooks/useProgress'

export function Labs() {
  const [domain, setDomain] = useState('all')
  const [difficulty, setDifficulty] = useState('all')
  const { isLabComplete, completedLabCount } = useProgress()
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
      return <Link to={`/labs/${lab.id}`} key={lab.id} className="card group p-5 transition hover:-translate-y-0.5 hover:shadow-lg">
        <div className="flex items-start gap-4"><span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${done ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-700'}`}>{done ? <CheckCircle2 /> : <FlaskConical />}</span><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-3"><div><p className="text-[11px] font-black uppercase tracking-wider text-cyan-600">{lab.objective} · {module?.title}</p><h2 className="mt-1 font-extrabold text-navy-950">{lab.title}</h2></div><ChevronRight className="shrink-0 text-slate-300 transition group-hover:translate-x-1" /></div><p className="mt-2 text-sm leading-5 text-slate-500">{lab.summary}</p><div className="mt-4 flex gap-3 text-xs font-bold text-slate-500"><span>{lab.difficulty}</span><span className="flex items-center gap-1"><Clock3 size={14}/>{lab.minutes} min</span></div></div></div>
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
        {topology && <NetworkTopology topology={topology} />}
        {lab.steps.map((step, index) => { const checked = checkedSteps.includes(index); return <section className={`card p-6 ${checked ? 'ring-2 ring-emerald-200' : ''}`} key={step.title}><div className="flex gap-4"><button aria-label={`${checked ? 'Mark incomplete' : 'Mark complete'}: ${step.title}`} onClick={() => void toggleStep(index)} className={`grid h-9 w-9 shrink-0 place-items-center rounded-full font-black ${checked ? 'bg-emerald-500 text-white' : 'bg-cyan-400 text-navy-950'}`}>{checked ? <Check size={19}/> : index + 1}</button><div className="min-w-0 flex-1"><div className="flex flex-wrap items-start justify-between gap-2"><h2 className="text-xl font-black text-navy-950">{step.title}</h2><button onClick={() => void toggleStep(index)} className="text-xs font-black text-emerald-700">{checked ? 'Completed' : 'Mark step done'}</button></div><ul className="mt-3 space-y-2">{step.instructions.map((item) => <li key={item} className="text-sm leading-6 text-slate-600">{item}</li>)}</ul>{step.commands && <div className="mt-4 overflow-x-auto rounded-xl bg-navy-950 p-4"><div className="mb-3 flex items-center gap-2 text-xs font-bold text-cyan-300"><TerminalSquare size={16}/>Cisco IOS CLI</div><pre className="text-sm leading-7 text-slate-100"><code>{step.commands.join('\n')}</code></pre></div>}</div></div></section>})}
        {lab.troubleshooting?.length ? <section className="card border border-amber-200 p-6"><h2 className="flex items-center gap-2 text-xl font-black text-navy-950"><Lightbulb className="text-amber-500"/>Troubleshooting hints</h2><ul className="mt-4 space-y-3">{lab.troubleshooting.map((item) => <li className="flex gap-2 text-sm leading-6 text-slate-600" key={item}><TriangleAlert className="mt-1 shrink-0 text-amber-500" size={16}/>{item}</li>)}</ul></section> : null}
      </div>
      <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start"><section className="card p-5"><h2 className="font-black text-navy-950">Lab goals</h2><ul className="mt-4 space-y-3">{lab.goals.map((goal) => <li className="flex gap-2 text-sm text-slate-600" key={goal}><CheckCircle2 className="shrink-0 text-cyan-600" size={18}/>{goal}</li>)}</ul></section><section className="card p-5"><h2 className="font-black text-navy-950">Verification checklist</h2><ul className="mt-4 space-y-3">{lab.verify.map((item) => <li className="flex gap-2 text-sm text-slate-600" key={item}><Circle className="mt-1 shrink-0 text-emerald-500" size={14}/>{item}</li>)}</ul><div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full bg-emerald-500 transition-all" style={{width: `${Math.round((checkedSteps.length / lab.steps.length) * 100)}%`}}/></div><p className="mt-2 text-xs font-bold text-slate-500">{checkedSteps.length} of {lab.steps.length} guided steps complete</p><button disabled={done || saving} onClick={markComplete} className={`mt-4 w-full rounded-xl px-4 py-3 text-sm font-black ${done ? 'bg-emerald-100 text-emerald-700' : 'bg-cyan-400 text-navy-950 hover:bg-cyan-300'}`}>{done ? 'Lab completed' : saving ? 'Saving…' : 'Complete and save lab'}</button></section></aside>
    </div>
  </>
}
