import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  user: process.env.DB_USER || 'muhfaiizr',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'triplevib',
  password: process.env.DB_PASSWORD || 'admin',
  port: process.env.DB_PORT || 5432,
});

export const query = (text, params) => pool.query(text, params);

export default pool;
