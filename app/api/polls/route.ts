import { initDB, getDB } from '@/lib/db';
import { candidatesWithImages } from '@/app/config/candidates';
import { NextResponse } from 'next/server';

// Initialize DB on first run
initDB();

export async function GET(request: Request) {
  return new Promise((resolve) => {
    const db = getDB();
    db.all(`
      SELECT p.*,
        (
          SELECT json_group_array(
            json_object('id', o.id, 'text', o.text, 'image_url', o.image_url)
          )
          FROM (
            SELECT *
            FROM options
            WHERE poll_id = p.id
            ORDER BY id asc
          ) o
        ) as options
      FROM polls p
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `, (err, polls) => {
      db.close();
      if (err) {
        resolve(NextResponse.json({ error: err.message }, { status: 500 }));
      } else {
        const candidateOrder = new Map(
          candidatesWithImages.map((candidate, index) => [candidate.name.toUpperCase(), index])
        );

        const parsedPolls = polls.map((p: any) => ({
          ...p,
          options: JSON.parse(p.options || '[]').sort((a: any, b: any) => {
            const aOrder = candidateOrder.get((a.text || '').toUpperCase()) ?? Number.MAX_SAFE_INTEGER;
            const bOrder = candidateOrder.get((b.text || '').toUpperCase()) ?? Number.MAX_SAFE_INTEGER;

            if (aOrder === bOrder) {
              return a.id - b.id;
            }

            return aOrder - bOrder;
          })
        }));
        resolve(NextResponse.json(parsedPolls));
      }
    });
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { question, options } = body;

  if (!question || !options || options.length < 2) {
    return NextResponse.json({ error: 'Invalid poll data' }, { status: 400 });
  }

  return new Promise((resolve) => {
    const db = getDB();
    db.run('INSERT INTO polls (question) VALUES (?)', [question], function(err) {
      if (err) {
        db.close();
        resolve(NextResponse.json({ error: err.message }, { status: 500 }));
        return;
      }

      const pollId = this.lastID;
      let completed = 0;

      options.forEach((option: string) => {
        db.run('INSERT INTO options (poll_id, text) VALUES (?, ?)',
          [pollId, option],
          (err) => {
            completed++;
            if (completed === options.length) {
              db.close();
              resolve(NextResponse.json({ id: pollId }));
            }
          }
        );
      });
    });
  });
}
