import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from './db.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET || 'triplevibe_secret_key_123';

app.use(cors());
app.use(express.json());

// --- Static Folder for Uploads ---
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// --- Multer Configuration ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

// --- Upload Route ---
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  const imageUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
  res.json({ url: imageUrl });
});

// --- Database Initialization ---
const initDB = async () => {
  try {
    // Create Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        first_name TEXT,
        last_name TEXT,
        role TEXT DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Drop existing incomplete projects table
    await pool.query('DROP TABLE IF EXISTS projects;');

    // Create Projects table with FULL schema
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

    // Seed Admin if not exists
    const adminCheck = await pool.query('SELECT * FROM users WHERE email = $1', ['superadmin@triplevibe.com']);
    if (adminCheck.rows.length === 0) {
      const hashedPw = await bcrypt.hash('admin123', 10);
      await pool.query(
        'INSERT INTO users (email, password, first_name, last_name, role) VALUES ($1, $2, $3, $4, $5)',
        ['superadmin@triplevibe.com', hashedPw, 'Super', 'Admin', 'superadmin']
      );
      console.log('✅ Admin user seeded');
    }

    console.log('✅ Database initialized');
  } catch (err) {
    console.error('❌ Database init error:', err.message);
  }
};

initDB();

// --- Auth Routes ---
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) return res.status(401).json({ message: 'Invalid credentials' });

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
    
    // Remove password from user object
    delete user.password;
    res.json({ user, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- Project Routes ---
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
      `INSERT INTO projects (title, slug, category, description, tags, image_url, gallery, deliverables, project_type, live_url, status, featured, sort_order) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
      [p.title, p.slug, p.category, p.description, p.tags, p.image_url, p.gallery || [], p.deliverables || [], p.project_type || 'web', p.live_url || '', p.status, p.featured, p.sort_order || 0]
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
      `UPDATE projects SET title=$1, slug=$2, category=$3, description=$4, tags=$5, image_url=$6, gallery=$7, deliverables=$8, project_type=$9, live_url=$10, status=$11, featured=$12, sort_order=$13
       WHERE id=$14 RETURNING *`,
      [p.title, p.slug, p.category, p.description, p.tags, p.image_url, p.gallery || [], p.deliverables || [], p.project_type || 'web', p.live_url || '', p.status, p.featured, p.sort_order || 0, id]
    );
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

app.get('/api/profiles', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, email, first_name, last_name, role, created_at FROM users ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
