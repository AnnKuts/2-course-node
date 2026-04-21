import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config(); 

const { Pool } = pg;
const useSsl = process.env.NODE_ENV === 'production' || process.env.DB_SSL === 'true';

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: useSsl ? { rejectUnauthorized: false } : false
});