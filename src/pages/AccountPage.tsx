import { CheckCircle2, Cloud, CloudOff, LogIn, LogOut, RefreshCw, UserPlus } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useAuth } from '../context/auth'
import { supabase } from '../lib/supabase'

export function AccountPage() {
  const { user, loading, syncing, syncError, refreshSync } = useAuth()
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  async function submit(event: FormEvent) {
    event.preventDefault(); setBusy(true); setMessage(null)
    const result = mode === 'signup' ? await supabase.auth.signUp({ email, password, options: { data: { display_name: name } } }) : await supabase.auth.signInWithPassword({ email, password })
    setBusy(false); setMessage(result.error ? result.error.message : mode === 'signup' && !result.data.session ? 'Check your email to confirm your account, then sign in.' : 'Signed in. Your progress is synchronizing now.')
  }

  async function sendPasswordReset() {
    if (!email) { setMessage('Enter your email address first.'); return }
    setBusy(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/ccna-master/account` })
    setBusy(false); setMessage(error?.message ?? 'Password-reset email sent. Open the link on this device.')
  }

  async function changePassword() {
    setBusy(true)
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    setBusy(false); setMessage(error?.message ?? 'Password updated successfully.')
    if (!error) setNewPassword('')
  }

  if (loading) return <div className="card mx-auto max-w-xl p-8 text-center text-slate-500">Loading account…</div>
  if (user) return <section className="mx-auto max-w-2xl">
    <header><p className="eyebrow">Cross-device account</p><h1 className="mt-1 text-3xl font-black text-navy-950">Cloud sync</h1><p className="mt-2 text-slate-600">Your activity is saved offline first and synchronized securely whenever you are online.</p></header>
    <div className="card mt-6 p-6 sm:p-8"><span className="grid h-14 w-14 place-items-center rounded-2xl bg-emerald-100 text-emerald-700"><Cloud/></span><h2 className="mt-5 text-xl font-black text-navy-950">{user.user_metadata.display_name || user.email?.split('@')[0]}</h2><p className="mt-1 text-sm text-slate-500">{user.email}</p>
      <div className={`mt-6 flex items-start gap-3 rounded-xl p-4 ${syncError ? 'bg-rose-50 text-rose-800' : 'bg-emerald-50 text-emerald-800'}`}>{syncError ? <CloudOff className="shrink-0" size={20}/> : <CheckCircle2 className="shrink-0" size={20}/>}<div><p className="font-black">{syncing ? 'Synchronizing…' : syncError ? 'Sync needs attention' : 'Cloud sync is active'}</p><p className="mt-1 text-sm">{syncError || 'Use this account on your phone and laptop to keep the same statistics.'}</p></div></div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2"><button onClick={() => void refreshSync()} disabled={syncing} className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-black text-navy-950 disabled:opacity-60"><RefreshCw size={17} className={syncing ? 'animate-spin' : ''}/>Sync now</button><button onClick={() => void supabase.auth.signOut()} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 py-3 text-sm font-black text-slate-700"><LogOut size={17}/>Sign out</button></div>
      <div className="mt-7 border-t border-slate-200 pt-6"><h3 className="font-black text-navy-950">Change password</h3><div className="mt-3 flex flex-col gap-3 sm:flex-row"><input type="password" minLength={8} value={newPassword} onChange={event => setNewPassword(event.target.value)} placeholder="New password (8+ characters)" className="min-w-0 flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-cyan-500"/><button disabled={busy || newPassword.length < 8} onClick={() => void changePassword()} className="rounded-xl bg-navy-950 px-5 py-3 text-sm font-black text-white disabled:opacity-50">Update password</button></div>{message && <p className="mt-3 text-sm text-slate-600">{message}</p>}</div>
    </div>
  </section>
  return <section className="mx-auto max-w-lg"><header className="text-center"><p className="eyebrow">One account, every device</p><h1 className="mt-1 text-3xl font-black text-navy-950">{mode === 'login' ? 'Sign in to CCNA Master' : 'Create your account'}</h1><p className="mt-2 text-slate-600">Your existing progress will be merged into your secure cloud account after sign-in.</p></header><form onSubmit={submit} className="card mt-6 space-y-4 p-6 sm:p-8">{mode === 'signup' && <Field label="Display name" type="text" value={name} onChange={setName} autoComplete="name"/>}<Field label="Email address" type="email" value={email} onChange={setEmail} autoComplete="email"/><Field label="Password" type="password" value={password} onChange={setPassword} autoComplete={mode === 'login' ? 'current-password' : 'new-password'}/><button disabled={busy} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 font-black text-navy-950 disabled:opacity-60">{mode === 'login' ? <LogIn size={18}/> : <UserPlus size={18}/>} {busy ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}</button>{message && <p className="rounded-xl bg-slate-100 p-3 text-sm text-slate-700">{message}</p>}{mode === 'login' && <button type="button" onClick={() => void sendPasswordReset()} className="w-full text-sm font-bold text-slate-600">Forgot password?</button>}<button type="button" onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setMessage(null) }} className="w-full text-sm font-bold text-cyan-700">{mode === 'login' ? 'New here? Create an account' : 'Already have an account? Sign in'}</button></form></section>
}

function Field({ label, type, value, onChange, autoComplete }: { label: string; type: string; value: string; onChange: (value: string) => void; autoComplete: string }) { return <label className="block text-sm font-bold text-slate-700">{label}<input required minLength={type === 'password' ? 8 : undefined} type={type} value={value} onChange={event => onChange(event.target.value)} autoComplete={autoComplete} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 font-normal outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"/></label> }
