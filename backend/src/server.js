import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from './db.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET || 'triplevibe_secret_key_123';
const WHATSAPP_NUMBER = process.env.WHATSAPP_NUMBER || '6281234567890';

app.use(cors());
app.use(express.json());

// --- Static Folder for Uploads ---
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// --- Multer Configuration ---
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Only image files are allowed'));
  },
});

// --- Upload Route ---
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  const imageUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
  res.json({ url: imageUrl, filename: req.file.filename, size: req.file.size });
});

// --- Database Initialization ---
const initDB = async () => {
  try {
    // Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        first_name TEXT,
        last_name TEXT,
        role TEXT DEFAULT 'viewer',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Projects table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        category TEXT NOT NULL,
        description TEXT NOT NULL,
        tags TEXT[] DEFAULT ARRAY[]::TEXT[],
        image_url TEXT,
        gallery TEXT[] DEFAULT ARRAY[]::TEXT[],
        deliverables TEXT[] DEFAULT ARRAY[]::TEXT[],
        project_type TEXT DEFAULT 'web',
        live_url TEXT,
        status TEXT DEFAULT 'draft',
        featured BOOLEAN DEFAULT false,
        sort_order INTEGER DEFAULT 0,
        published_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Testimonials table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS testimonials (
        id SERIAL PRIMARY KEY,
        client_name TEXT NOT NULL,
        client_title TEXT,
        client_avatar_url TEXT,
        message TEXT NOT NULL,
        rating INTEGER DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
        is_featured BOOLEAN DEFAULT false,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // WhatsApp leads tracking table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS wa_leads (
        id SERIAL PRIMARY KEY,
        source TEXT NOT NULL,
        project_id INTEGER REFERENCES projects(id) ON DELETE SET NULL,
        project_title TEXT,
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Visitor analytics (page views)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS page_views (
        id SERIAL PRIMARY KEY,
        page TEXT NOT NULL,
        project_id INTEGER REFERENCES projects(id) ON DELETE SET NULL,
        project_title TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Site settings for CMS
    await pool.query(`
      CREATE TABLE IF NOT EXISTS site_settings (
        id SERIAL PRIMARY KEY,
        setting_key TEXT UNIQUE NOT NULL,
        setting_value TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Seed default site settings if empty
    const { rows: settingsRows } = await pool.query('SELECT COUNT(*) FROM site_settings');
    if (parseInt(settingsRows[0].count) === 0) {
      const defaultSettings = [
        ['home_hero_title', 'The Benchmark of Digital Excenllence.'],
        ['home_hero_subtitle', 'Kami tidak sekadar menulis kode; kami merancang ekosistem digital performa tinggi untuk bisnis yang menuntut kualitas tanpa kompromi.'],
        ['expertise_hero_title', 'Arsitektur Digital\\nTanpa Kompromi.'],
        ['expertise_hero_subtitle', 'Kami membangun solusi perangkat lunak dengan presisi teknik sipil. Dari infrastruktur cloud hingga antarmuka mobile, setiap baris kode adalah fondasi masa depan bisnis Anda.'],
        ['process_hero_title', 'Arsitektur Alur Kerja yang Presisi.'],
        ['process_hero_subtitle', 'Kami tidak sekadar membangun kode; kami merancang ekosistem digital. Setiap langkah dalam proses kami diatur dengan ketelitian teknis untuk memastikan hasil akhir yang monumental dan tahan lama.'],
        ['site_whatsapp', '6281234567890'],
        ['site_email', 'hello@triplevibe.com'],
        ['site_address', 'Jakarta, Indonesia']
      ];
      for (const [key, value] of defaultSettings) {
        await pool.query('INSERT INTO site_settings (setting_key, setting_value) VALUES ($1, $2)', [key, value]);
      }
    }

    // Seed Super Admin if not exists
    const adminCheck = await pool.query('SELECT * FROM users WHERE email = $1', ['superadmin@triplevibe.com']);
    if (adminCheck.rows.length === 0) {
      const hashedPw = await bcrypt.hash('admin123', 10);
      await pool.query(
        'INSERT INTO users (email, password, first_name, last_name, role) VALUES ($1, $2, $3, $4, $5)',
        ['superadmin@triplevibe.com', hashedPw, 'Super', 'Admin', 'superadmin']
      );
      console.log('✅ Admin user seeded');
    }

    // Seed a sample testimonial if empty
    const testCheck = await pool.query('SELECT COUNT(*) FROM testimonials');
    if (parseInt(testCheck.rows[0].count) === 0) {
      await pool.query(
        `INSERT INTO testimonials (client_name, client_title, message, rating, is_featured, sort_order)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        ['Raka Ardiansyah', 'IT Student, Jakarta',
         'Kerja sama dengan TripleVibe benar-benar luar biasa. Arsitektur sistem e-commerce kami menjadi jauh lebih modern, cepat, dan stabil.',
         5, true, 1]
      );
    }

    console.log('✅ Database initialized');
  } catch (err) {
    console.error('❌ Database init error:', err.message);
  }
};

initDB();

// ===========================================
// AUTH ROUTES
// ===========================================
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) return res.status(401).json({ message: 'Invalid credentials' });

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
    delete user.password;
    res.json({ user, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ===========================================
// PROJECT ROUTES
// ===========================================
app.get('/api/projects', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM projects ORDER BY featured DESC, sort_order ASC, created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/projects', async (req, res) => {
  const p = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO projects (title, slug, category, description, tags, image_url, gallery, deliverables, project_type, live_url, status, featured, sort_order, published_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING *`,
      [p.title, p.slug, p.category, p.description, p.tags, p.image_url,
       p.gallery || [], p.deliverables || [], p.project_type || 'web',
       p.live_url || '', p.status, p.featured, p.sort_order || 0, p.published_at || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put('/api/projects/:id', async (req, res) => {
  const { id } = req.params;
  const p = req.body;
  try {
    const result = await pool.query(
      `UPDATE projects SET title=$1, slug=$2, category=$3, description=$4, tags=$5, image_url=$6,
       gallery=$7, deliverables=$8, project_type=$9, live_url=$10, status=$11, featured=$12, sort_order=$13, published_at=$14
       WHERE id=$15 RETURNING *`,
      [p.title, p.slug, p.category, p.description, p.tags, p.image_url,
       p.gallery || [], p.deliverables || [], p.project_type || 'web',
       p.live_url || '', p.status, p.featured, p.sort_order || 0, p.published_at || null, id]
    );
    if (!result.rows[0]) return res.status(404).json({ message: 'Project not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete('/api/projects/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM projects WHERE id = $1', [id]);
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ===========================================
// USER MANAGEMENT ROUTES
// ===========================================
app.get('/api/profiles', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, email, first_name, last_name, role, created_at FROM users ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new user (admin only)
app.post('/api/users', async (req, res) => {
  const { email, password, first_name, last_name, role } = req.body;
  try {
    const hashedPw = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (email, password, first_name, last_name, role) VALUES ($1,$2,$3,$4,$5) RETURNING id, email, first_name, last_name, role, created_at',
      [email, hashedPw, first_name || '', last_name || '', role || 'viewer']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(400).json({ message: 'Email already exists' });
    res.status(500).json({ message: err.message });
  }
});

// Update user role
app.put('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  const { role, first_name, last_name } = req.body;
  try {
    const result = await pool.query(
      'UPDATE users SET role=$1, first_name=$2, last_name=$3 WHERE id=$4 RETURNING id, email, first_name, last_name, role, created_at',
      [role, first_name, last_name, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete user
app.delete('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ===========================================
// TESTIMONIAL ROUTES
// ===========================================
app.get('/api/testimonials', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM testimonials ORDER BY is_featured DESC, sort_order ASC, created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/testimonials', async (req, res) => {
  const t = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO testimonials (client_name, client_title, client_avatar_url, message, rating, is_featured, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [t.client_name, t.client_title || '', t.client_avatar_url || '', t.message, t.rating || 5, t.is_featured || false, t.sort_order || 0]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put('/api/testimonials/:id', async (req, res) => {
  const { id } = req.params;
  const t = req.body;
  try {
    const result = await pool.query(
      `UPDATE testimonials SET client_name=$1, client_title=$2, client_avatar_url=$3, message=$4, rating=$5, is_featured=$6, sort_order=$7
       WHERE id=$8 RETURNING *`,
      [t.client_name, t.client_title || '', t.client_avatar_url || '', t.message, t.rating || 5, t.is_featured || false, t.sort_order || 0, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete('/api/testimonials/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM testimonials WHERE id = $1', [id]);
    res.json({ message: 'Testimonial deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ===========================================
// WHATSAPP LEAD TRACKING
// ===========================================
app.get('/api/wa/number', (req, res) => {
  res.json({ number: WHATSAPP_NUMBER });
});

app.post('/api/wa/track', async (req, res) => {
  const { source, project_id, project_title } = req.body;
  try {
    await pool.query(
      'INSERT INTO wa_leads (source, project_id, project_title, user_agent) VALUES ($1,$2,$3,$4)',
      [source || 'general', project_id || null, project_title || null, req.headers['user-agent'] || '']
    );
    res.json({ message: 'Lead tracked' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/wa/stats', async (req, res) => {
  try {
    const total = await pool.query('SELECT COUNT(*) FROM wa_leads');
    const bySource = await pool.query(`
      SELECT source, COUNT(*) as count
      FROM wa_leads GROUP BY source ORDER BY count DESC
    `);
    const byProject = await pool.query(`
      SELECT project_title, COUNT(*) as count
      FROM wa_leads WHERE project_title IS NOT NULL
      GROUP BY project_title ORDER BY count DESC LIMIT 10
    `);
    const recent = await pool.query('SELECT * FROM wa_leads ORDER BY created_at DESC LIMIT 10');
    res.json({
      total: parseInt(total.rows[0].count),
      by_source: bySource.rows,
      by_project: byProject.rows,
      recent: recent.rows
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ===========================================
// VISITOR ANALYTICS
// ===========================================
app.post('/api/analytics/pageview', async (req, res) => {
  const { page, project_id, project_title } = req.body;
  try {
    await pool.query(
      'INSERT INTO page_views (page, project_id, project_title) VALUES ($1,$2,$3)',
      [page || '/', project_id || null, project_title || null]
    );
    res.json({ message: 'View tracked' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/analytics/stats', async (req, res) => {
  try {
    const totalViews = await pool.query('SELECT COUNT(*) FROM page_views');
    const totalLeads = await pool.query('SELECT COUNT(*) FROM wa_leads');
    const viewsByPage = await pool.query(`
      SELECT page, COUNT(*) as count
      FROM page_views GROUP BY page ORDER BY count DESC
    `);
    const viewsByProject = await pool.query(`
      SELECT project_title, COUNT(*) as count
      FROM page_views WHERE project_title IS NOT NULL
      GROUP BY project_title ORDER BY count DESC LIMIT 10
    `);
    const last7Days = await pool.query(`
      SELECT DATE(created_at) as date, COUNT(*) as count
      FROM page_views
      WHERE created_at >= NOW() - INTERVAL '7 days'
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `);
    res.json({
      total_views: parseInt(totalViews.rows[0].count),
      total_leads: parseInt(totalLeads.rows[0].count),
      by_page: viewsByPage.rows,
      by_project: viewsByProject.rows,
      last_7_days: last7Days.rows
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ===========================================
// MEDIA LIBRARY
// ===========================================
// --- Media Library Routes ---
app.get('/api/media', async (req, res) => {
  try {
    const files = fs.readdirSync(uploadsDir);
    const media = files.map(filename => {
      const stats = fs.statSync(path.join(uploadsDir, filename));
      return {
        filename,
        url: `http://localhost:${PORT}/uploads/${filename}`,
        size: stats.size,
        created_at: stats.mtime
      };
    }).filter(f => f.filename !== '.gitkeep')
      .sort((a, b) => b.created_at - a.created_at);
    res.json(media);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/media/:filename', async (req, res) => {
  try {
    const filename = req.params.filename;
    if (filename === '.gitkeep') return res.status(403).json({ error: 'Cannot delete .gitkeep' });
    const filepath = path.join(uploadsDir, filename);
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
      res.json({ message: 'File deleted' });
    } else {
      res.status(404).json({ error: 'File not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- Site Settings CMS Routes ---
app.get('/api/settings', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT setting_key, setting_value FROM site_settings');
    const settings = rows.reduce((acc, row) => ({ ...acc, [row.setting_key]: row.setting_value }), {});
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/settings', async (req, res) => {
  try {
    const settings = req.body; // e.g. { home_hero_title: '...', etc }
    for (const [key, value] of Object.entries(settings)) {
      await pool.query(
        'INSERT INTO site_settings (setting_key, setting_value) VALUES ($1, $2) ON CONFLICT (setting_key) DO UPDATE SET setting_value = EXCLUDED.setting_value, updated_at = CURRENT_TIMESTAMP',
        [key, value]
      );
    }
    res.json({ message: 'Settings updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===========================================
// SEO / OpenGraph META
// ===========================================
app.get('/api/meta/project/:slug', async (req, res) => {
  const { slug } = req.params;
  try {
    const result = await pool.query('SELECT * FROM projects WHERE slug = $1 AND status = $2', [slug, 'published']);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Project not found' });
    const p = result.rows[0];
    res.json({
      title: `${p.title} – TripleVibe Portfolio`,
      description: p.description?.slice(0, 160) || '',
      image: p.image_url || '',
      url: `https://triplevibe.com/projects/${p.slug}`,
      type: 'article',
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ===========================================
// SEO & BOT OPTIMIZATION (BLUEPRINT)
// ===========================================

// 1. REAL-TIME SITEMAP
app.get('/api/public/sitemap.xml', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT slug, updated_at, created_at FROM projects WHERE status = $1 ORDER BY created_at DESC', ['published']);
    
    // Asumsikan URL frontend di production adalah ROOT_URL
    const baseUrl = 'http://localhost:5173';
    
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/expertise</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/process</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/projects</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`;

    rows.forEach((project) => {
      const lastMod = new Date(project.updated_at || project.created_at).toISOString();
      sitemap += `
  <url>
    <loc>${baseUrl}/projects/${project.slug}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
    });

    sitemap += '\n</urlset>';

    res.header('Content-Type', 'application/xml');
    res.send(sitemap);
  } catch (err) {
    res.status(500).send('Error generating sitemap');
  }
});

// 2. BOT INTERCEPTION & DYNAMIC RENDERING 
// (Middleware ini menangkap request dari crawler ketika Nginx proxy pass ke Node)
app.use(async (req, res, next) => {
  const userAgent = req.headers['user-agent'] || '';
  const isBot = /googlebot|bingbot|yandex|baiduspider|twitterbot|facebookexternalhit|whatsapp|linkedinbot|slackbot|vkShare/i.test(userAgent);

  if (!isBot || req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
    return next();
  }

  // Jika BOT dan mengakses halaman detail project (misal: /projects/slug-project)
  if (req.path.startsWith('/projects/')) {
    const slug = req.path.split('/')[2];
    try {
      const { rows } = await pool.query('SELECT * FROM projects WHERE slug = $1', [slug]);
      if (rows.length > 0) {
        const p = rows[0];
        const publicUrl = `http://localhost:5173${req.path}`;
        const imageUrl = p.image_url || `http://localhost:${PORT}/uploads/default.jpg`;
        
        const rawHTML = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>${p.title} | TripleVibe Project</title>
    <meta name="description" content="${p.description}">
    <!-- Open Graph -->
    <meta property="og:type" content="article">
    <meta property="og:url" content="${publicUrl}">
    <meta property="og:title" content="${p.title}">
    <meta property="og:description" content="${p.description}">
    <meta property="og:image" content="${imageUrl}">
    <meta property="og:site_name" content="TripleVibe Portfolio">
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${p.title}">
    <meta name="twitter:description" content="${p.description}">
    <meta name="twitter:image" content="${imageUrl}">
    <!-- Schema.org JSON-LD -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "${p.title}",
      "image": "${imageUrl}",
      "description": "${p.description}",
      "datePublished": "${p.published_at || p.created_at}",
      "dateModified": "${p.updated_at || p.created_at}",
      "author": { "@type": "Organization", "name": "TripleVibe" }
    }
    </script>
</head>
<body>
    <h1>${p.title}</h1>
    <p>${p.description}</p>
    <img src="${imageUrl}" alt="${p.title}">
</body>
</html>`;
        return res.send(rawHTML);
      }
    } catch (err) {
      console.error('Bot intercept error:', err);
    }
  }

  // Jika bot, tapi bukan halaman detail, kirim meta default Home.
  const rawHTML = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>TripleVibe | Engineering Firm & Digital Architect</title>
    <meta name="description" content="Membangun solusi arsitektur digital dengan pendekatan engineering profesional.">
    <meta property="og:title" content="TripleVibe | Engineering Firm">
    <meta property="og:description" content="Membangun solusi arsitektur digital dengan pendekatan engineering profesional.">
</head>
<body><h1>TripleVibe Engineering</h1></body>
</html>`;
  return res.send(rawHTML);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
