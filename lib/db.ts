import sqlite3 from 'sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'votes.db');

export function initDB() {
  const db = new sqlite3.Database(dbPath);

  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS polls (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        question TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS options (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        poll_id INTEGER NOT NULL,
        text TEXT NOT NULL,
        image_url TEXT,
        FOREIGN KEY(poll_id) REFERENCES polls(id)
      )
    `);

    db.run(`
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

    db.run(`CREATE INDEX IF NOT EXISTS idx_voter_hash ON votes(voter_hash)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_poll_id ON votes(poll_id)`);
  });

  return db;
}

export function getDB(): sqlite3.Database {
  return new sqlite3.Database(dbPath);
}

