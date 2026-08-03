import { BarChart3, BookOpen, FlaskConical, GraduationCap, Home, Menu, Network, X } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Dashboard', icon: Home }, { to: '/learn', label: 'Learn', icon: BookOpen },
  { to: '/labs', label: 'Labs', icon: FlaskConical }, { to: '/practice', label: 'Practice', icon: GraduationCap },
  { to: '/progress', label: 'Progress', icon: BarChart3 },
]

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const nav = links.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} end={to === '/'} onClick={() => setOpen(false)} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${isActive ? 'bg-cyan-400 text-navy-950' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}><Icon size={19} />{label}</NavLink>)
  return <div className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-[260px_1fr]">
    <aside className="hidden min-h-screen bg-navy-950 p-5 lg:sticky lg:top-0 lg:block lg:h-screen"><Brand /><nav className="mt-10 space-y-2">{nav}</nav><div className="absolute bottom-7 left-5 right-5 rounded-2xl bg-white/5 p-4 text-sm text-slate-300"><p className="font-bold text-white">CCNA 200-301</p><p className="mt-1 text-xs leading-5">Build practical skills, one focused session at a time.</p></div></aside>
    <div className="min-w-0"><header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur lg:px-8"><div className="lg:hidden"><Brand dark /></div><button className="rounded-lg p-2 lg:hidden" onClick={() => setOpen(!open)} aria-label="Toggle navigation">{open ? <X /> : <Menu />}</button><div className="ml-auto hidden items-center gap-3 sm:flex"><span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-bold text-cyan-700">3 day streak</span><div className="grid h-9 w-9 place-items-center rounded-full bg-navy-900 text-sm font-bold text-white">GM</div></div></header>
      {open && <div className="fixed inset-x-0 top-16 z-20 bg-navy-950 p-4 shadow-xl lg:hidden"><nav className="space-y-2">{nav}</nav></div>}
      <main className="mx-auto max-w-7xl p-4 pb-24 sm:p-6 lg:p-8">{children}</main>
    </div>
    <nav className="fixed inset-x-0 bottom-0 z-30 flex justify-around border-t border-slate-200 bg-white px-2 py-2 lg:hidden">{links.slice(0, 5).map(({to,label,icon:Icon}) => <NavLink key={to} to={to} end={to === '/'} className={({isActive}) => `flex min-w-14 flex-col items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-bold ${isActive ? 'text-cyan-600' : 'text-slate-500'}`}><Icon size={19}/>{label}</NavLink>)}</nav>
  </div>
}

function Brand({ dark = false }: { dark?: boolean }) { return <NavLink to="/" className={`flex items-center gap-3 font-black tracking-tight ${dark ? 'text-navy-950' : 'text-white'}`}><span className="grid h-9 w-9 place-items-center rounded-xl bg-cyan-400 text-navy-950"><Network size={21}/></span><span>CCNA <span className="text-cyan-500">Master</span></span></NavLink> }
