import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zixsflnndbdqanjgnkhi.supabase.co'
const supabasePublishableKey = 'sb_publishable_N7SyDyTSR7pWTSU61Y8-2A_EU4AK2zN'

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
})
