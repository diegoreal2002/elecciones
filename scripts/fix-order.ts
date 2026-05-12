import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';

// Read candidates order from app/config/candidates.ts by parsing the exported array.
const candidatesFile = path.join(process.cwd(), 'app', 'config', 'candidates.ts');
let candidatesWithImages: Array<{ name: string; image: string }> = [];
try {
  const content = fs.readFileSync(candidatesFile, 'utf8');
  const itemRegex = /\{\s*name:\s*'([^']+)'\s*,\s*image:\s*'([^']*)'\s*\}/g;
  let match;
  while ((match = itemRegex.exec(content)) !== null) {
    candidatesWithImages.push({ name: match[1], image: match[2] });
  }
  if (candidatesWithImages.length === 0) {
    throw new Error('No candidates parsed from candidates.ts');
  }
} catch (err: any) {
  console.error('Failed to read/parse candidates.ts:', err.message || err);
  process.exit(1);
}

const dbPath = path.join(process.cwd(), 'votes.db');
const db = new sqlite3.Database(dbPath);

console.log('Fixing options order from candidatesWithImages...');

db.serialize(() => {
  db.get('SELECT id FROM polls ORDER BY created_at DESC LIMIT 1', (err: any, row: any) => {
    if (err) {
      console.error('Error fetching poll:', err);
      db.close();
      process.exit(1);
    }

    if (!row) {
      console.error('No poll found to reinsert options into.');
      db.close();
      process.exit(1);
    }

    const pollId = row.id;
    console.log('Target poll id:', pollId);

    db.run('DELETE FROM options WHERE poll_id = ?', [pollId], function(delErr: any) {
      if (delErr) {
        console.error('Error deleting existing options:', delErr);
        db.close();
        process.exit(1);
      }

      const stmt = db.prepare('INSERT INTO options (poll_id, text, image_url) VALUES (?, ?, ?)');
      candidatesWithImages.forEach((c: any) => {
        stmt.run(pollId, c.name, c.image || null);
      });
      stmt.finalize((finalizeErr: any) => {
        if (finalizeErr) console.error('Finalize error:', finalizeErr);
        console.log('Reinserted', candidatesWithImages.length, 'options in the specified order.');
        db.close();
        process.exit(0);
      });
    });
  });
});
