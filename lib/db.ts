import { Pool } from "pg";

type GlobalWithPool = typeof globalThis & {
  pool?: Pool;
};

const globalForPool = globalThis as GlobalWithPool;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

export const pool =
  globalForPool.pool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

// cache en dev uniquement
if (process.env.NODE_ENV !== "production") {
  globalForPool.pool = pool;
}

// helper avec gestion d’erreur propre
export async function query(text: string, params?: any[]) {
  try {
    return await pool.query(text, params);
  } catch (err) {
    console.error("DB ERROR:", err);
    throw err;
  }
}