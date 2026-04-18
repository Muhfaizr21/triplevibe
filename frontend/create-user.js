import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, './.env') })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!supabaseUrl || !supabaseKey || supabaseKey.includes('sb_publishable')) {
  console.error('❌ ERROR: API Key di .env masih salah atau menggunakan kunci Stripe.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function createAdmin() {
  const email = 'superadmin@triplevibe.com'
  const password = 'admin123'

  console.log(`🚀 Menmdaftarkan akun: ${email}...`)

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: 'Super',
        last_name: 'Admin',
        role: 'superadmin'
      }
    }
  })

  if (error) {
    if (error.message.includes('already registered')) {
      console.log('✅ Akun sudah ada! Silakan langsung login.')
    } else {
      console.error('❌ GAGAL:', error.message)
    }
  } else {
    console.log('🎉 BERHASIL! Akun admin telah dibuat.')
    console.log('Silakan login dengan:')
    console.log(`Email: ${email}`)
    console.log(`Password: ${password}`)
    console.log('\n(Pastikan Anda sudah menjalankan SQL di Supabase sebelumnya agar role-nya terbaca as superadmin)')
  }
}

createAdmin()
