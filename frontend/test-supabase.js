import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, './.env') })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Environment variables VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY are missing.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  console.log('Testing connection to Supabase...')
  console.log('URL:', supabaseUrl)
  
  // Try to fetch something generic (like settings or just check if auth works)
  const { data, error } = await supabase.auth.getSession()

  if (error) {
    console.error('Connection failed:', error.message)
  } else {
    console.log('Connection successful! Supabase is responding.')
    console.log('Session data retrieved:', data ? 'Yes' : 'No')
  }
}

testConnection()
