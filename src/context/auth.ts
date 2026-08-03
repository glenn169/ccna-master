import { createContext, useContext } from 'react'
import type { User } from '@supabase/supabase-js'

export interface AuthValue { user: User | null; loading: boolean; syncing: boolean; syncError: string | null; refreshSync: () => Promise<void> }
export const AuthContext = createContext<AuthValue | null>(null)

export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth must be used inside AuthProvider')
  return value
}
