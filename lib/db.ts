import { createClient, type Client } from '@libsql/client';
import { candidatesWithImages } from '@/app/config/candidates';

let client: Client | null = null;
let initialized = false;

function requireEnv(name: 'TURSO_DATABASE_URL' | 'TURSO_AUTH_TOKEN'): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

export function getDB(): Client {
  if (!client) {
    client = createClient({
      url: requireEnv('TURSO_DATABASE_URL'),
      authToken: requireEnv('TURSO_AUTH_TOKEN')
    });
  }

  return client;
}

export async function initDB(): Promise<void> {
  if (initialized) {
    return;
  }

  const db = getDB();

  await db.execute(`
    CREATE TABLE IF NOT EXISTS polls (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS options (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      poll_id INTEGER NOT NULL,
      text TEXT NOT NULL,
      image_url TEXT,
      FOREIGN KEY(poll_id) REFERENCES polls(id)
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS votes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      poll_id INTEGER NOT NULL,
      option_id INTEGER NOT NULL,
      voter_hash TEXT NOT NULL UNIQUE,
      ip_address TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(poll_id) REFERENCES polls(id),
      FOREIGN KEY(option_id) REFERENCES options(id)
    )
  `);

  await db.execute(`CREATE INDEX IF NOT EXISTS idx_voter_hash ON votes(voter_hash)`);
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_poll_id ON votes(poll_id)`);

  const pollCount = await db.execute(`SELECT COUNT(*) as count FROM polls`);
  const count = Number(pollCount.rows[0]?.count ?? 0);

  if (count === 0) {
    const insertPoll = await db.execute({
      sql: 'INSERT INTO polls (question) VALUES (?)',
      args: ['¿Por quién votarías en las elecciones presidenciales 2026?']
    });

    const pollId = Number(insertPoll.lastInsertRowid ?? 0);
    for (const candidate of candidatesWithImages) {
      await db.execute({
        sql: 'INSERT INTO options (poll_id, text, image_url) VALUES (?, ?, ?)',
        args: [pollId, candidate.name, candidate.image || null]
      });
    }
  }

  initialized = true;
}

