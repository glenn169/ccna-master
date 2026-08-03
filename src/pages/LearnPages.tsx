import { ArrowLeft, ArrowRight, Check, CheckCircle2, Clock3, LockKeyhole, Router, Server, Shield, Wifi, Zap } from 'lucide-react'
import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { findLesson, findModule } from '../data'
import { completeLesson, useProgress } from '../hooks/useProgress'

export function ModulePage() {
  const { moduleId } = useParams()
  const module = findModule(moduleId)
  const { isLessonComplete, modulePercent } = useProgress()
  if (!module) return <Navigate to="/learn" replace />
  const progress = modulePercent(module.id)
  return <>
    <Link to="/learn" className="inline-flex items-center gap-2 text-sm font-bold text-slate-600"><ArrowLeft size={17}/>All modules</Link>
    <section className="mt-5 overflow-hidden rounded-3xl bg-navy-950 p-6 text-white sm:p-8"><p className="eyebrow">Domain {module.weight}%</p><h1 className="mt-2 text-3xl font-black sm:text-4xl">{module.title}</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">{module.description}</p><div className="mt-6 flex items-center gap-3"><div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-cyan-400" style={{width:`${progress}%`}}/></div><span className="text-sm font-black">{progress}%</span></div></section>
    <section className="mt-7"><h2 className="text-xl font-black text-navy-950">Lessons</h2><div className="mt-4 space-y-3">{module.lessons.map((lesson, index) => { const complete = isLessonComplete(lesson.id); return <article className="card flex items-center gap-4 p-4 sm:p-5" key={lesson.id}><span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl font-black ${complete ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>{complete ? <Check size={20}/> : index+1}</span><div className="min-w-0 flex-1"><p className="text-xs font-bold text-cyan-600">Objective {lesson.objective}</p><h3 className="mt-1 font-extrabold text-navy-950">{lesson.title}</h3><p className="mt-1 flex items-center gap-1 text-xs font-semibold text-slate-500"><Clock3 size={13}/>{lesson.duration} min</p></div>{lesson.available ? <Link to={`/learn/${module.id}/${lesson.id}`} className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-cyan-400 text-navy-950" aria-label={`Open ${lesson.title}`}><ArrowRight size={19}/></Link> : <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-400" title="Coming soon"><LockKeyhole size={17}/></span>}</article>})}</div></section>
  </>
}

const components = [
  { icon: Router, name: 'Routers', text: 'Connect different IP networks and choose the best path for packets.' },
  { icon: Server, name: 'Layer 2 and Layer 3 switches', text: 'Forward frames inside a LAN; multilayer switches can also route between networks.' },
  { icon: Shield, name: 'Firewalls and IPS', text: 'Enforce security policy and identify or stop malicious traffic.' },
  { icon: Wifi, name: 'Access points and controllers', text: 'Connect wireless clients and centrally coordinate WLAN configuration.' },
  { icon: Zap, name: 'Endpoints, servers and PoE', text: 'Consume or provide network services; PoE supplies power and data over Ethernet.' },
]

export function LessonPage() {
  const { moduleId, lessonId } = useParams()
  const module = findModule(moduleId)
  const lesson = findLesson(moduleId, lessonId)
  const { isLessonComplete } = useProgress()
  const [saving, setSaving] = useState(false)
  if (!module || !lesson || !lesson.available) return <Navigate to={module ? `/learn/${module.id}` : '/learn'} replace />
  const complete = isLessonComplete(lesson.id)
  async function finishLesson() { if (!module || !lesson || complete) return; setSaving(true); await completeLesson(lesson.id, module.id, module.lessons.length, lesson.duration); setSaving(false) }
  return <article className="mx-auto max-w-4xl">
    <Link to={`/learn/${module.id}`} className="inline-flex items-center gap-2 text-sm font-bold text-slate-600"><ArrowLeft size={17}/>{module.title}</Link>
    <header className="mt-5 rounded-3xl bg-navy-950 p-6 text-white sm:p-9"><p className="eyebrow">Objective {lesson.objective} · {lesson.duration} minutes</p><h1 className="mt-3 text-3xl font-black sm:text-5xl">{lesson.title}</h1><p className="mt-4 max-w-2xl leading-7 text-slate-300">Learn what the main network components do and how they work together to deliver secure connectivity.</p></header>
    <div className="mt-7 space-y-7 text-slate-700">
      <section className="card p-6 sm:p-8"><h2 className="text-2xl font-black text-navy-950">The big picture</h2><p className="mt-3 leading-7">A network moves data between endpoints and the services they use. Switches connect devices locally, routers connect separate networks, wireless equipment provides radio access, and security devices inspect traffic. Knowing each role helps you choose the correct device when reading a topology or troubleshooting a fault.</p></section>
      <section><h2 className="text-2xl font-black text-navy-950">Core components</h2><div className="mt-4 grid gap-4 sm:grid-cols-2">{components.map(({icon:Icon,name,text}) => <div className="card p-5" key={name}><Icon className="text-cyan-600"/><h3 className="mt-3 font-black text-navy-950">{name}</h3><p className="mt-2 text-sm leading-6">{text}</p></div>)}</div></section>
      <section className="rounded-2xl border border-cyan-200 bg-cyan-50 p-6"><h2 className="font-black text-cyan-900">Exam memory check</h2><p className="mt-2 text-sm leading-6 text-cyan-900">A switch normally forwards traffic within a LAN using MAC addresses. A router forwards traffic between IP networks using a routing table. An access point bridges wireless clients onto the wired network.</p></section>
      <section className="card p-6 sm:p-8"><h2 className="text-xl font-black text-navy-950">Quick recap</h2><ul className="mt-4 space-y-3 text-sm leading-6"><li>• Endpoints originate or receive data.</li><li>• Servers provide shared applications, storage, addressing, naming and other services.</li><li>• Controllers centralize management for infrastructure such as wireless networks.</li><li>• Power over Ethernet can power access points, IP phones and cameras through the data cable.</li></ul></section>
    </div>
    <div className="sticky bottom-20 mt-8 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-soft backdrop-blur lg:bottom-4"><button onClick={finishLesson} disabled={complete || saving} className={`flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 font-black transition ${complete ? 'bg-emerald-100 text-emerald-800' : 'bg-cyan-400 text-navy-950 hover:bg-cyan-300 disabled:opacity-60'}`}>{complete ? <><CheckCircle2 size={19}/>Lesson completed</> : saving ? 'Saving…' : <><Check size={19}/>Mark lesson complete</>}</button></div>
  </article>
}
