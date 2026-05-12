import { initDB, getDB } from '@/lib/db';
import { candidatesWithImages } from '@/app/config/candidates';
import { NextResponse } from 'next/server';

export async function GET(request: Request): Promise<NextResponse> {
  try {
    await initDB();
    const db = getDB();

    const pollsResult = await db.execute(`
      SELECT id, question, created_at
      FROM polls
      ORDER BY created_at DESC
    `);

    const candidateOrder = new Map(
      candidatesWithImages.map((candidate, index) => [candidate.name.toUpperCase(), index])
    );

    const parsedPolls = await Promise.all(
      pollsResult.rows.map(async (poll: any) => {
        const optionsResult = await db.execute({
          sql: `
            SELECT id, text, image_url
            FROM options
            WHERE poll_id = ?
            ORDER BY id ASC
          `,
          args: [poll.id]
        });

        const options = optionsResult.rows.map((option: any) => ({
          id: Number(option.id),
          text: String(option.text),
          image_url: option.image_url ? String(option.image_url) : null
        })).sort((a: any, b: any) => {
          const aOrder = candidateOrder.get((a.text || '').toUpperCase()) ?? Number.MAX_SAFE_INTEGER;
          const bOrder = candidateOrder.get((b.text || '').toUpperCase()) ?? Number.MAX_SAFE_INTEGER;

          if (aOrder === bOrder) {
            return a.id - b.id;
          }

          return aOrder - bOrder;
        });

        return {
          id: Number(poll.id),
          question: String(poll.question),
          created_at: String(poll.created_at),
          options
        };
      })
    );

    return NextResponse.json(parsedPolls);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Database error' }, { status: 500 });
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  const body = await request.json();
  const { question, options } = body;

  if (!question || !options || options.length < 2) {
    return NextResponse.json({ error: 'Invalid poll data' }, { status: 400 });
  }

  try {
    await initDB();
    const db = getDB();

    const insertPoll = await db.execute({
      sql: 'INSERT INTO polls (question) VALUES (?)',
      args: [question]
    });

    const pollId = Number(insertPoll.lastInsertRowid ?? 0);
    for (const option of options as string[]) {
      await db.execute({
        sql: 'INSERT INTO options (poll_id, text) VALUES (?, ?)',
        args: [pollId, option]
      });
    }

    return NextResponse.json({ id: pollId });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Database error' }, { status: 500 });
  }
}
