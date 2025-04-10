import { createClient } from '@supabase/supabase-js'
import type { Database } from './supabase.types'

const supabaseUrl = 'https://mgrkbldjwxbtktcbzrlg.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ncmtibGRqd3hidGt0Y2J6cmxnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyMjI1NTEsImV4cCI6MjA1OTc5ODU1MX0.AH9szEopta5zQgLwWMiAck-3EsYUZFJ_Sf-HF4P8dQk'

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)