import { CheckCircle2, FlaskConical } from 'lucide-react'
import { modules } from '../data'
import { PageHeader } from '../components/PageHeader'
import { useProgress } from '../hooks/useProgress'

export function Labs() { const labs=['Build a basic IPv4 LAN','Configure VLANs and trunks','Inter-VLAN routing','Single-area OSPFv2']; return <><PageHeader eyebrow="Hands-on practice" title="Configuration labs" text="Build confidence with guided Packet Tracer labs that move from topology setup to verification and troubleshooting."/><div className="space-y-3">{labs.map((lab,i)=><article className="card flex items-center gap-4 p-5" key={lab}><span className="grid h-11 w-11 place-items-center rounded-xl bg-amber-50 font-black text-amber-700">{i+1}</span><div className="flex-1"><h2 className="font-extrabold text-navy-950">{lab}</h2><p className="mt-1 text-xs font-semibold text-slate-500">{20+i*10} min · Beginner</p></div><FlaskConical className="text-slate-400"/></article>)}</div></> }

export function Progress() {
  const { modulePercent, summary } = useProgress()
  const accuracy = summary.questionsAnswered ? Math.round((summary.correctAnswers / summary.questionsAnswered) * 100) : 0
  return <><PageHeader eyebrow="Your performance" title="Practice progress" text="See your real question activity, accuracy, and topic mastery across the six CCNA domains."/><div className="mb-5 grid grid-cols-2 gap-3"><div className="card p-5"><p className="text-2xl font-black text-navy-950">{summary.questionsAnswered}</p><p className="text-xs font-semibold text-slate-500">Questions answered</p></div><div className="card p-5"><p className="text-2xl font-black text-navy-950">{accuracy}%</p><p className="text-xs font-semibold text-slate-500">Overall accuracy</p></div></div><div className="card p-6"><h2 className="text-xl font-black">Topic mastery by domain</h2><div className="mt-6 space-y-5">{modules.map(({id,title}) => { const progress=modulePercent(id); return <div key={id}><div className="flex justify-between text-sm font-bold"><span>{title}</span><span>{progress}%</span></div><div className="mt-2 h-3 rounded-full bg-slate-100"><div className="h-3 rounded-full bg-cyan-400" style={{width:`${progress}%`}}/></div></div>})}</div><div className="mt-7 flex items-center gap-3 rounded-xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-800"><CheckCircle2/>Quiz results are saved on this device and begin at zero.</div></div></>
}

export function NotFound() { return <div className="grid min-h-[60vh] place-items-center text-center"><div><p className="text-7xl font-black text-cyan-400">404</p><h1 className="mt-3 text-2xl font-black">Page not found</h1><a href="/ccna-master/" className="mt-5 inline-block font-bold text-cyan-600">Return to dashboard</a></div></div> }
