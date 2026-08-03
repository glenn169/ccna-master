import { ArrowRight, CheckCircle2, Clock3, Flame } from 'lucide-react'
import { Link } from 'react-router-dom'
import { modules } from '../data'
import { formatStudyTime, useProgress } from '../hooks/useProgress'

export function Dashboard() {
  const { summary, modulePercent } = useProgress()
  const currentModule = modulePercent(modules[0].id)
  const stats = [[Flame, `${summary.streakDays} days`, 'Current streak'], [Clock3, formatStudyTime(summary.studyMinutes), 'Study time'], [CheckCircle2, String(summary.lessonsCompleted), 'Lessons done'], [ArrowRight, `${currentModule}%`, 'Current module']] as const
  return <>
    <section className="overflow-hidden rounded-3xl bg-navy-950 p-6 text-white sm:p-9"><p className="eyebrow">Welcome back, Glenn</p><div className="mt-3 grid gap-8 md:grid-cols-[1fr_auto] md:items-end"><div><h1 className="max-w-2xl text-3xl font-black tracking-tight sm:text-5xl">Your CCNA journey starts with one clear next step.</h1><p className="mt-4 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">Continue Network Fundamentals and turn concepts into practical configuration skills.</p></div><Link to="/learn" className="inline-flex w-fit items-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-black text-navy-950 transition hover:bg-cyan-300">Continue learning <ArrowRight size={18}/></Link></div></section>
    <section className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">{stats.map(([Icon,value,label]) => <div className="card p-4 sm:p-5" key={label}><Icon className="text-cyan-500" size={21}/><p className="mt-3 text-2xl font-black text-navy-950">{value}</p><p className="text-xs font-semibold text-slate-500">{label}</p></div>)}</section>
    <section className="mt-8"><div className="mb-4 flex items-end justify-between"><div><p className="eyebrow">Exam blueprint</p><h2 className="mt-1 text-2xl font-black text-navy-950">Continue your modules</h2></div><Link to="/learn" className="text-sm font-bold text-cyan-600">View all</Link></div><div className="grid gap-4 md:grid-cols-2">{modules.map(({id,title,description,icon:Icon,accent}) => { const progress = modulePercent(id); return <article className="card p-5" key={id}><div className="flex gap-4"><div className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${accent}`}><Icon size={21}/></div><div className="min-w-0 flex-1"><div className="flex justify-between gap-3"><h3 className="font-extrabold text-navy-950">{title}</h3><span className="text-xs font-bold text-slate-500">{progress}%</span></div><p className="mt-1 text-sm leading-5 text-slate-500">{description}</p><div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-cyan-400" style={{width:`${progress}%`}}/></div></div></div></article>})}</div></section>
  </>
}
