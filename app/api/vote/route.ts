import { getDB } from '@/lib/db';
import { getClientIP, generateVoterHash, generateDeviceFingerprint } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const { pollId, optionId, deviceFingerprint } = body;

  if (!pollId || !optionId || !deviceFingerprint) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const ip = getClientIP(request);
  const userAgent = request.headers.get('user-agent') || 'unknown';
  const voterHash = generateVoterHash(ip, deviceFingerprint);

  return new Promise((resolve) => {
    const db = getDB();

    db.get('SELECT id FROM votes WHERE voter_hash = ? AND poll_id = ?',
      [voterHash, pollId],
      (err, row) => {
        if (err) {
          db.close();
          resolve(NextResponse.json({ error: err.message }, { status: 500 }));
          return;
        }

        if (row) {
          db.close();
          resolve(NextResponse.json({ error: 'Already voted' }, { status: 409 }));
          return;
        }

        db.get(
          'SELECT id FROM options WHERE id = ? AND poll_id = ?',
          [optionId, pollId],
          (optionErr, optionRow) => {
            if (optionErr) {
              db.close();
              resolve(NextResponse.json({ error: optionErr.message }, { status: 500 }));
              return;
            }

            if (!optionRow) {
              db.close();
              resolve(NextResponse.json({ error: 'Invalid option for poll' }, { status: 400 }));
              return;
            }

            db.run(
              'INSERT INTO votes (poll_id, option_id, voter_hash, ip_address) VALUES (?, ?, ?, ?)',
              [pollId, optionId, voterHash, ip],
              (insertErr) => {
                db.close();
                if (insertErr) {
                  resolve(NextResponse.json({ error: insertErr.message }, { status: 500 }));
                } else {
                  resolve(NextResponse.json({ success: true }));
                }
              }
            );
          }
        );
      }
    );
  });
}
