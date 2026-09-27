import { neon } from '@neondatabase/serverless';
import type { Quote } from '../types';

const DB_URL = import.meta.env.VITE_DATABASE_URL || '';

export function getNeonClient(connectionString?: string) {
  const url = connectionString || DB_URL;
  if (!url) return null;
  return neon(url);
}

export async function fetchQuotesFromNeon(connectionString?: string): Promise<Quote[]> {
  const sql = getNeonClient(connectionString);
  if (!sql) return [];
  try {
    const rows = await sql`SELECT id, text, author, category, theme, is_custom, likes FROM quotes ORDER BY RANDOM() LIMIT 200`;
    return rows.map(r => ({
      id: r.id as string,
      text: r.text as string,
      author: r.author as string,
      category: r.category as string,
      theme: r.theme as string,
      is_custom: r.is_custom as boolean,
      likes: r.likes as number,
    }));
  } catch (err) {
    console.error('Neon fetch error:', err);
    return [];
  }
}

export async function testNeonConnection(connectionString: string): Promise<boolean> {
  try {
    const sql = neon(connectionString);
    await sql`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}
