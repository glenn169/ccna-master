import { Award, BarChart3, Bell, ClipboardCheck, Cloud, CloudOff, FlaskConical, GraduationCap, Home, Menu, Moon, Network, Sparkles, Sun, User, X } from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { useProgress } from '../hooks/useProgress'
import { useAuth } from '../context/auth'

const links = [
  { to: '/', label: 'Dashboard', icon: Home }, { to: '/practice', label: 'Practice', icon: GraduationCap },
  { to: '/practice/study', label: 'Study Mode', icon: Sparkles },
  { to: '/labs', label: 'Labs', icon: FlaskConical },
  { to: '/exam', label: 'Exam', icon: ClipboardCheck },
  { to: '/progress', label: 'Progress', icon: BarChart3 },
  { to: '/achievements', label: 'Goals', icon: Award },
]

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [dark, setDark] = useState(() => localStorage.getItem('ccna-theme') === 'dark' || (!localStorage.getItem('ccna-theme') && matchMedia('(prefers-color-scheme: dark)').matches))
  const [reminder, setReminder] = useState(false)
  const { summary, studyPreferences } = useProgress()
  const { user, syncing, syncError } = useAuth()
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    document.documentElement.style.colorScheme = dark ? 'dark' : 'light'
    localStorage.setItem('ccna-theme', dark ? 'dark' : 'light')
  }, [dark])
  useEffect(() => {
    if (!studyPreferences.reminderEnabled) return
    const check = () => {
      const now = new Date()
      const today = now.toLocaleDateString('en-CA')
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
      const key = `ccna-reminder-${today}`
      if (currentTime >= studyPreferences.reminderTime && summary.lastStudyDate !== today && !localStorage.getItem(key)) {
        localStorage.setItem(key, 'shown')
        setReminder(true)
        if ('Notification' in window && Notification.permission === 'granted') new Notification('Time for CCNA practice', { body: `Your ${studyPreferences.dailyGoalMinutes}-minute daily goal is waiting.` })
      }
    }
    check()
    const timer = window.setInterval(check, 60_000)
    return () => window.clearInterval(timer)
  }, [studyPreferences, summary.lastStudyDate])
  const nav = links.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} end={to === '/'} onClick={() => setOpen(false)} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${isActive ? 'bg-cyan-400 text-navy-950' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}><Icon size={19} />{label}</NavLink>)
  return <div className="min-h-screen bg-slate-50 transition-colors lg:grid lg:grid-cols-[260px_1fr]">
    <a href="#main-content" className="fixed left-3 top-3 z-[100] -translate-y-24 rounded-lg bg-cyan-400 px-4 py-2 font-black text-navy-950 transition focus:translate-y-0">Skip to main content</a>
    <aside className="hidden min-h-screen bg-navy-950 p-5 lg:sticky lg:top-0 lg:block lg:h-screen"><Brand /><nav className="mt-10 space-y-2">{nav}</nav><div className="absolute bottom-7 left-5 right-5 rounded-2xl bg-white/5 p-4 text-sm text-slate-300"><p className="font-bold text-white">CCNA 200-301</p><p className="mt-1 text-xs leading-5">Build practical skills, one focused session at a time.</p></div></aside>
    <div className="min-w-0"><header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur lg:px-8"><div className="lg:hidden"><Brand dark /></div><button className="rounded-lg p-2 lg:hidden" onClick={() => setOpen(!open)} aria-label="Toggle navigation">{open ? <X /> : <Menu />}</button><div className="ml-auto flex items-center gap-2 sm:gap-3"><NavLink to="/achievements" className="hidden rounded-full bg-cyan-50 px-3 py-1 text-xs font-bold text-cyan-700 sm:inline">{summary.streakDays} day streak</NavLink><button onClick={() => setDark(value => !value)} className="rounded-xl bg-slate-100 p-2.5 text-slate-700 transition hover:bg-slate-200" aria-label={`Switch to ${dark ? 'light' : 'dark'} mode`}>{dark ? <Sun size={18}/> : <Moon size={18}/>}</button><NavLink to="/account" className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-black ${user ? syncError ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>{user ? syncError ? <CloudOff size={17}/> : <Cloud size={17} className={syncing ? 'animate-pulse' : ''}/> : <User size={17}/>}<span className="hidden sm:inline">{user ? syncing ? 'Syncing' : 'Synced' : 'Sign in'}</span></NavLink></div></header>
      {open && <div className="fixed inset-x-0 top-16 z-20 bg-navy-950 p-4 shadow-xl lg:hidden"><nav className="space-y-2">{nav}</nav></div>}
      <main id="main-content" tabIndex={-1} className="mx-auto max-w-7xl p-4 pb-24 sm:p-6 lg:p-8">{children}</main>
      {reminder && <div role="status" className="fixed bottom-20 right-4 z-50 max-w-sm rounded-2xl bg-navy-950 p-4 text-white shadow-2xl"><div className="flex gap-3"><Bell className="shrink-0 text-cyan-400"/><div><p className="font-black">Your daily goal is waiting</p><p className="mt-1 text-sm text-slate-300">A short focused session keeps your streak moving.</p><NavLink to="/practice/study" onClick={() => setReminder(false)} className="mt-3 inline-block text-sm font-black text-cyan-400">Start practice</NavLink></div><button onClick={() => setReminder(false)} className="self-start" aria-label="Dismiss reminder"><X size={18}/></button></div></div>}
    </div>
    <nav className="fixed inset-x-0 bottom-0 z-30 flex justify-around border-t border-slate-200 bg-white px-2 py-2 lg:hidden">{links.slice(0, 5).map(({to,label,icon:Icon}) => <NavLink key={to} to={to} end={to === '/'} className={({isActive}) => `flex min-w-14 flex-col items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-bold ${isActive ? 'text-cyan-600' : 'text-slate-500'}`}><Icon size={19}/>{label}</NavLink>)}</nav>
  </div>
}

function Brand({ dark = false }: { dark?: boolean }) { return <NavLink to="/" className={`flex items-center gap-3 font-black tracking-tight ${dark ? 'text-navy-950 dark:text-white' : 'text-white'}`}><span className="grid h-9 w-9 place-items-center rounded-xl bg-cyan-400 text-navy-950"><Network size={21}/></span><span>CCNA <span className="text-cyan-500">Master</span></span></NavLink> }
