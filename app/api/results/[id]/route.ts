import { getDB } from '@/lib/db';
import { initDB } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse> {
  const { id: pollId } = await params;

  try {
    await initDB();
    const db = getDB();

    const results = await db.execute({
      sql: `
        SELECT
          o.id,
          o.text,
          COALESCE(COUNT(v.id), 0) as votes
        FROM options o
        LEFT JOIN votes v ON o.id = v.option_id AND v.poll_id = ?
        WHERE o.poll_id = ?
        GROUP BY o.id, o.text
        ORDER BY votes DESC, o.id ASC
      `,
      args: [pollId, pollId]
    });

    const parsedResults = results.rows.map((row: any) => ({
      id: Number(row.id),
      text: String(row.text),
      votes: Number(row.votes ?? 0)
    }));

    const totalVotes = parsedResults.reduce((sum, row) => sum + row.votes, 0);

    return NextResponse.json({
      results: parsedResults,
      totalVotes
    });
  } catch (err: any) {
    console.error('SQL Error:', err);
    return NextResponse.json({ error: err?.message || 'Database error' }, { status: 500 });
  }
}


