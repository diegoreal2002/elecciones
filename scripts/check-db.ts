import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./votes.db');

console.log('\n=== VERIFICANDO BASE DE DATOS ===\n');

// Polls
db.all('SELECT * FROM polls', (err: any, polls: any) => {
  console.log('📋 POLLS:');
  console.log(polls);
});

// Options count
db.get('SELECT COUNT(*) as count FROM options', (err: any, result: any) => {
  console.log('\n📊 TOTAL OPCIONES:', result?.count);
});

// Votes count
db.get('SELECT COUNT(*) as count FROM votes', (err: any, result: any) => {
  console.log('🗳️ TOTAL VOTOS:', result?.count);
});

// Primeros 3 votos
db.all('SELECT * FROM votes LIMIT 3', (err: any, votes: any) => {
  console.log('\n📝 VOTOS (primeros 3):');
  console.log(votes);
});

// Resultados por opción
console.log('\n📈 RESULTADOS:');
db.all(`
  SELECT
    o.id,
    o.text,
    COALESCE(COUNT(v.id), 0) as votes
  FROM options o
  LEFT JOIN votes v ON o.id = v.option_id AND v.poll_id = 1
  WHERE o.poll_id = 1
  GROUP BY o.id, o.text
  ORDER BY votes DESC, o.id ASC
  LIMIT 5
`, (err: any, results: any) => {
  console.log(results);
  db.close();
  process.exit(0);
});
