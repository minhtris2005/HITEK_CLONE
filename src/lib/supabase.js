import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://dqkuvmsvhazyrtursbnc.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxa3V2bXN2aGF6eXJ0dXJzYm5jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0NTYyODcsImV4cCI6MjA3OTAzMjI4N30.t1IPgivVBsRedmUT23rhwelDLWABKRsXxtpCv3XFtaA'

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase credentials missing. Check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)