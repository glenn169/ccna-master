import type { Session } from '@supabase/supabase-js'
import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import { syncProgress } from '../services/progressSync'
import { AuthContext } from './auth'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [syncError, setSyncError] = useState<string | null>(null)
  const refreshSync = useCallback(async () => { if (!session?.user || !navigator.onLine) return; setSyncing(true); setSyncError(null); try { await syncProgress(session.user) } catch (error) { setSyncError(error instanceof Error ? error.message : 'Cloud sync failed') } finally { setSyncing(false) } }, [session?.user])

  useEffect(() => { supabase.auth.getSession().then(({ data }) => { setSession(data.session); setLoading(false) }); const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => { setSession(nextSession); setLoading(false) }); return () => data.subscription.unsubscribe() }, [])
  useEffect(() => { if (!session?.user) return; void refreshSync(); const syncWhenActive = () => { if (document.visibilityState === 'visible') void refreshSync() }; window.addEventListener('online', syncWhenActive); document.addEventListener('visibilitychange', syncWhenActive); const interval = window.setInterval(() => void refreshSync(), 60_000); return () => { window.removeEventListener('online', syncWhenActive); document.removeEventListener('visibilitychange', syncWhenActive); window.clearInterval(interval) } }, [session?.user, refreshSync])
  const value = useMemo(() => ({ user: session?.user ?? null, loading, syncing, syncError, refreshSync }), [session, loading, syncing, syncError, refreshSync])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
