import { Award, Bell, BellOff, BookOpenCheck, Check, Flame, FlaskConical, Medal, ShieldCheck, Target, Trophy } from 'lucide-react'
import { useMemo, useState } from 'react'
import { saveStudyPreferences, useProgress } from '../hooks/useProgress'

const localDate = () => {
  const now = new Date()
  return new Date(now.getTime() - now.getTimezoneOffset() * 60_000).toISOString().slice(0, 10)
}

export function AchievementsPage() {
  const { summary, completedLabCount, bestExamScore, quizAttempts, examAttempts, customQuizAttempts, studyPreferences } = useProgress()
  const [saved, setSaved] = useState(false)
  const [goal, setGoal] = useState(studyPreferences.dailyGoalMinutes)
  const [time, setTime] = useState(studyPreferences.reminderTime)
  const today = localDate()
  const todayMinutes = useMemo(() => {
    const quiz = quizAttempts.filter(item => item.completedAt.startsWith(today)).reduce((sum, item) => sum + Math.max(1, Math.ceil(item.total / 2)), 0)
    const exams = examAttempts.filter(item => item.completedAt.startsWith(today)).reduce((sum, item) => sum + Math.max(1, Math.ceil(item.durationSeconds / 60)), 0)
    const custom = customQuizAttempts.filter(item => item.completedAt.startsWith(today)).reduce((sum, item) => sum + Math.max(1, Math.ceil(item.total / 2)), 0)
    return quiz + exams + custom
  }, [customQuizAttempts, examAttempts, quizAttempts, today])
  const goalPercent = Math.min(100, Math.round((todayMinutes / goal) * 100))
  const achievements = [
    { title: 'First Step', text: 'Answer your first question', earned: summary.questionsAnswered >= 1, icon: Check },
    { title: 'Question Explorer', text: 'Answer 100 questions', earned: summary.questionsAnswered >= 100, icon: BookOpenCheck },
    { title: 'Practice Pro', text: 'Answer 500 questions', earned: summary.questionsAnswered >= 500, icon: Trophy },
    { title: 'Lab Starter', text: 'Complete your first lab', earned: completedLabCount >= 1, icon: FlaskConical },
    { title: 'Lab Engineer', text: 'Complete 10 guided labs', earned: completedLabCount >= 10, icon: ShieldCheck },
    { title: 'On Fire', text: 'Reach a 7-day study streak', earned: summary.streakDays >= 7, icon: Flame },
    { title: 'Exam Ready', text: 'Score at least 80% in a mock exam', earned: bestExamScore >= 80, icon: Medal },
    { title: 'CCNA Master', text: 'Score at least 90% in a full simulation', earned: examAttempts.some(item => item.mode === 'full' && item.score / item.total >= .9), icon: Award },
  ]
  const earnedCount = achievements.filter(item => item.earned).length

  async function save() {
    await saveStudyPreferences({ dailyGoalMinutes: goal, reminderTime: time })
    setSaved(true)
    window.setTimeout(() => setSaved(false), 1800)
  }

  async function toggleReminder() {
    const enabled = !studyPreferences.reminderEnabled
    if (enabled && 'Notification' in window && Notification.permission === 'default') await Notification.requestPermission()
    await saveStudyPreferences({ reminderEnabled: enabled, reminderTime: time, dailyGoalMinutes: goal })
  }

  return <>
    <header><p className="eyebrow">Consistency rewards</p><h1 className="mt-2 text-3xl font-black text-navy-950">Goals & achievements</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Build a sustainable study habit and unlock milestones as your CCNA skills improve.</p></header>
    <section className="mt-6 grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
      <div className="card p-5 sm:p-6"><div className="flex items-center justify-between"><div><p className="eyebrow">Today</p><h2 className="mt-1 text-xl font-black text-navy-950">Daily study goal</h2></div><span className="grid h-12 w-12 place-items-center rounded-2xl bg-cyan-50 text-cyan-700"><Target/></span></div><p className="mt-5 text-3xl font-black text-navy-950">{todayMinutes} <span className="text-base text-slate-500">/ {goal} minutes</span></p><div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-label="Daily study goal" aria-valuenow={goalPercent} aria-valuemin={0} aria-valuemax={100}><div className="h-full rounded-full bg-cyan-400 transition-all" style={{ width: `${goalPercent}%` }}/></div><p className="mt-2 text-sm font-semibold text-slate-500">{goalPercent >= 100 ? 'Daily goal complete—excellent work!' : `${goal - todayMinutes} focused minutes remaining.`}</p><div className="mt-6 flex flex-wrap items-end gap-3"><label className="text-sm font-bold text-slate-700">Daily target<select value={goal} onChange={event => setGoal(Number(event.target.value))} className="mt-1 block rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"><option value={10}>10 minutes</option><option value={20}>20 minutes</option><option value={30}>30 minutes</option><option value={45}>45 minutes</option><option value={60}>60 minutes</option></select></label><label className="text-sm font-bold text-slate-700">Reminder time<input type="time" value={time} onChange={event => setTime(event.target.value)} className="mt-1 block rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm" /></label><button onClick={save} className="rounded-xl bg-navy-950 px-4 py-2.5 text-sm font-black text-white">{saved ? 'Saved' : 'Save goal'}</button></div><button onClick={toggleReminder} className="mt-4 inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-black text-slate-700">{studyPreferences.reminderEnabled ? <BellOff size={18}/> : <Bell size={18}/>}{studyPreferences.reminderEnabled ? 'Turn reminder off' : 'Turn reminder on'}</button><p className="mt-2 text-xs leading-5 text-slate-500">Reminders appear while CCNA Master is open. Browser notifications are used when permission is available.</p></div>
      <div className="card p-5 sm:p-6"><p className="eyebrow">Reward progress</p><h2 className="mt-1 text-xl font-black text-navy-950">{earnedCount} of {achievements.length} unlocked</h2><div className="mt-5 grid grid-cols-2 gap-3"><div className="rounded-2xl bg-amber-50 p-4"><Flame className="text-amber-600"/><p className="mt-2 text-2xl font-black text-navy-950">{summary.streakDays}</p><p className="text-xs font-bold text-slate-500">day streak</p></div><div className="rounded-2xl bg-violet-50 p-4"><Trophy className="text-violet-600"/><p className="mt-2 text-2xl font-black text-navy-950">{earnedCount}</p><p className="text-xs font-bold text-slate-500">achievements</p></div></div><p className="mt-5 text-sm leading-6 text-slate-500">Complete at least one lesson, quiz, exam, or lab each day to protect your streak.</p></div>
    </section>
    <section className="mt-8"><div><p className="eyebrow">Milestones</p><h2 className="mt-1 text-2xl font-black text-navy-950">Achievement collection</h2></div><div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{achievements.map(({ title, text, earned, icon: Icon }) => <article key={title} className={`card p-5 ${earned ? '' : 'opacity-55 grayscale'}`}><span className={`grid h-11 w-11 place-items-center rounded-xl ${earned ? 'bg-cyan-50 text-cyan-700' : 'bg-slate-100 text-slate-500'}`}><Icon size={21}/></span><h3 className="mt-4 font-black text-navy-950">{title}</h3><p className="mt-1 text-sm leading-5 text-slate-500">{text}</p><p className={`mt-3 text-xs font-black uppercase tracking-wide ${earned ? 'text-emerald-600' : 'text-slate-400'}`}>{earned ? 'Unlocked' : 'Locked'}</p></article>)}</div></section>
  </>
}
