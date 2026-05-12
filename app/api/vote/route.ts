import { getDB, initDB } from '@/lib/db';
import { getClientIP, generateVoterHash } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  const body = await request.json();
  const { pollId, optionId, deviceFingerprint } = body;

  if (!pollId || !optionId || !deviceFingerprint) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const ip = getClientIP(request);
  const voterHash = generateVoterHash(ip, deviceFingerprint);

  try {
    await initDB();
    const db = getDB();

    const existingVote = await db.execute({
      sql: 'SELECT id FROM votes WHERE voter_hash = ? AND poll_id = ? LIMIT 1',
      args: [voterHash, pollId]
    });

    if (existingVote.rows.length > 0) {
      return NextResponse.json({ error: 'Already voted' }, { status: 409 });
    }

    const option = await db.execute({
      sql: 'SELECT id FROM options WHERE id = ? AND poll_id = ? LIMIT 1',
      args: [optionId, pollId]
    });

    if (option.rows.length === 0) {
      return NextResponse.json({ error: 'Invalid option for poll' }, { status: 400 });
    }

    await db.execute({
      sql: 'INSERT INTO votes (poll_id, option_id, voter_hash, ip_address) VALUES (?, ?, ?, ?)',
      args: [pollId, optionId, voterHash, ip]
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Database error' }, { status: 500 });
  }
}
