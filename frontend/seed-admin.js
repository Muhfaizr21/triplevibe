import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, './.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Mission VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
  console.log('Please add SUPABASE_SERVICE_ROLE_KEY to your frontend/.env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function seedSuperAdmin() {
  const email = process.env.SEED_ADMIN_EMAIL || 'superadmin@triplevibe.com';
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!password) {
    console.error('Error: SEED_ADMIN_PASSWORD belum diisi di frontend/.env');
    process.exit(1);
  }
  
  console.log(`Creating superadmin account: ${email}...`);

  // 1. Create the user in auth.users
  const { error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { 
      first_name: 'Super',
      last_name: 'Admin',
      role: 'superadmin' 
    }
  });

  if (authError) {
    if (authError.message.includes('already registered')) {
      console.log('User already exists, attempting to update metadata...');
      // Get the existing user
      const { data: { users } } = await supabase.auth.admin.listUsers();
      const existingUser = users.find(u => u.email === email);
      
      if (existingUser) {
        // Update both metadata and profile
        await supabase.auth.admin.updateUserById(existingUser.id, {
          user_metadata: { role: 'superadmin' }
        });

        const { error: profileError } = await supabase
          .from('profiles')
          .update({ role: 'superadmin' })
          .eq('id', existingUser.id);
          
        if (profileError) console.log('Notice: Could not update profiles table (maybe it does not exist yet), but user metadata was updated.');
        else console.log('Successfully promoted existing user to superadmin in both metadata and profiles!');
      }
    } else {
      console.error('Error creating auth user:', authError.message);
    }
    return;
  }

  console.log('Superadmin account created successfully!');
  console.log('Email:', email);
  console.log('Password:', password);
  console.log('\nIMPORTANT: Make sure you have run the migrations in backend/supabase/migrations/setup.sql first!');
}

seedSuperAdmin();
