import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, './.env') })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!serviceKey) {
  console.error('❌ ERROR: SUPABASE_SERVICE_ROLE_KEY tidak ditemukan di .env')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceKey)

async function setup() {
  console.log('🚀 Menyiapkan tabel "projects" di Supabase...')

  console.log('\nHarap pastikan Anda sudah menjalankan SQL ini di Dashboard Supabase (SQL Editor):')
  console.log(`
  CREATE TABLE IF NOT EXISTS public.projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    tags TEXT[] DEFAULT ARRAY[]::TEXT[] NOT NULL,
    image_url TEXT,
    gallery TEXT[] DEFAULT ARRAY[]::TEXT[] NOT NULL,
    deliverables TEXT[] DEFAULT ARRAY[]::TEXT[] NOT NULL,
    project_type TEXT DEFAULT 'web' NOT NULL,
    live_url TEXT,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')) NOT NULL,
    featured BOOLEAN DEFAULT false NOT NULL,
    sort_order INTEGER DEFAULT 0 NOT NULL,
    published_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
  );
  ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
  CREATE POLICY "Public published projects are viewable by everyone." ON public.projects FOR SELECT USING (status = 'published');
  CREATE POLICY "Admins can read all projects." ON public.projects FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin'))
  );
  CREATE POLICY "Admins can manage projects." ON public.projects FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin'))
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin'))
  );
  `)
  
  console.log('\nJika sudah, skrip ini akan mencoba memasukkan data contoh...')
  
  const { error } = await supabase.from('projects').insert([
    {
      title: 'Lumina Wealth Ecosystem',
      slug: 'lumina-wealth-ecosystem',
      category: 'FinTech',
      description: 'Project inisial dari seeder.',
      tags: ['React', 'Go'],
      image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCuB40Mn-N8lzycpIVONZbZnu4l3HQQsh5VY5SK2wrnvhmtaP3gx2d4ZdMsg0PeurqgprFp8ZKJnA_Rbk0OBqcP5_EoONk6aL7GxqMdJ1Vq29Z5ZOx2idy4OSPefsubN1nNBHbDPpxqE0HA6Yyixs04OHjtj1hm_KCA3KM22oRRQxaKvAZ6jnmEtP5OEWnZHy-te2xRPG5Hdm1z1YQArl6T1pxnT-YKQ6GZIa-mthZu8P5sgrmdciUlSvQp_sFXsAVc51iJ37NO2fOu',
      gallery: [],
      deliverables: ['Discovery', 'Engineering', 'Release Support'],
      project_type: 'web',
      live_url: 'https://example.com',
      status: 'published',
      featured: true,
      sort_order: 1,
      published_at: new Date().toISOString()
    }
  ])

  if (error) {
    if (error.code === '42P01') {
      console.error('❌ ERROR: Tabel "projects" belum ada. Anda HARUS menjalankan SQL di atas dulu di Dashboard Supabase.')
    } else {
      console.error('❌ ERROR:', error.message)
    }
  } else {
    console.log('✅ BERHASIL: Tabel terdeteksi dan data contoh dimasukkan!')
  }
}

setup()
