import { getDB } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: pollId } = await params;

  return new Promise((resolve) => {
    const db = getDB();
    db.all(`
      SELECT
        o.id,
        o.text,
        COALESCE(COUNT(v.id), 0) as votes
      FROM options o
      LEFT JOIN votes v ON o.id = v.option_id AND v.poll_id = ?
      WHERE o.poll_id = ?
      GROUP BY o.id, o.text
      ORDER BY votes DESC, o.id ASC
    `, [pollId, pollId], (err, results) => {
      if (err) {
        db.close();
        console.error('SQL Error:', err);
        resolve(NextResponse.json({ error: err.message }, { status: 500 }));
      } else {
        const totalVotes = results?.reduce((sum: number, r: any) => sum + parseInt(r.votes || 0), 0) || 0;
        db.close();
        resolve(NextResponse.json({
          results: results || [],
          totalVotes
        }));
      }
    });
  });
}


