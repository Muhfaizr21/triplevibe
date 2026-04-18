import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, './.env') })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('--- SUPABASE AUDIT START ---')
console.log('URL:', supabaseUrl)
console.log('Publishable Key:', supabaseKey ? 'PRESENT' : 'MISSING')
console.log('Service Role Key:', serviceKey ? 'PRESENT' : 'MISSING')

const supabase = createClient(supabaseUrl, supabaseKey)

async function audit() {
  console.log('\n[1] Testing Connection...')
  const { error: healthError } = await supabase.from('profiles').select('count', { count: 'exact', head: true })
  
  if (healthError) {
    if (healthError.code === '42P01') {
      console.error('❌ ERROR: Tabel "profiles" TIDAK DITEMUKAN. Anda harus menjalankan setup.sql!');
    } else if (healthError.message.includes('API key')) {
      console.error('❌ ERROR: API Key tidak valid.');
    } else {
      console.error('❌ ERROR:', healthError.message);
    }
  } else {
    console.log('✅ SUCCESS: Koneksi ke Supabase OK dan tabel "profiles" ditemukan.');
  }

  if (serviceKey) {
    console.log('\n[2] Testing Admin Access (Service Role)...')
    const adminClient = createClient(supabaseUrl, serviceKey)
    const { data: users, error: userError } = await adminClient.auth.admin.listUsers()
    
    if (userError) {
      console.error('❌ ERROR Admin Access:', userError.message)
      console.log('   (Berarti SUPABASE_SERVICE_ROLE_KEY yang Anda masukkan masih salah)');
    } else {
      console.log('✅ SUCCESS: Admin Access OK.');
      console.log(`✅ Total User terdaftar: ${users.users.length}`);
      
      const admin = users.users.find(u => u.email === 'superadmin@triplevibe.com');
      if (admin) {
        console.log('✅ SUCCESS: Akun superadmin@triplevibe.com DITEMUKAN.');
        console.log('   Metadata Role:', admin.user_metadata?.role || 'NOT SET');
      } else {
        console.warn('⚠️ WARNING: Akun superadmin@triplevibe.com BELUM DIBUAT.');
      }
    }
  }

  console.log('\n--- AUDIT COMPLETED ---')
}

audit()
