import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = path.join(process.cwd(), 'votes.db');

// Force delete
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
  console.log('✓ Old database deleted');
}

const db = new sqlite3.Database(dbPath);

console.log('Creating schema...');

db.serialize(() => {
  // Polls table
  db.run(`
    CREATE TABLE polls (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Options table with image_url
  db.run(`
    CREATE TABLE options (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      poll_id INTEGER NOT NULL,
      text TEXT NOT NULL,
      image_url TEXT,
      FOREIGN KEY(poll_id) REFERENCES polls(id)
    )
  `);

  // Votes table
  db.run(`
    CREATE TABLE votes (
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

  // Indexes
  db.run(`CREATE INDEX idx_voter_hash ON votes(voter_hash)`);
  db.run(`CREATE INDEX idx_poll_id ON votes(poll_id)`);

  // Insert poll
  db.run(
    'INSERT INTO polls (question) VALUES (?)',
    ['¿Por quién votarías en las elecciones presidenciales 2026?'],
    function(this: any) {
      const pollId = this.lastID;
      console.log('✓ Poll created with ID:', pollId);

      const candidates = [
        { name: 'Iván Cepeda', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Perfil_Iv%C3%A1n_Cepeda_%28cropped%29.jpg/250px-Perfil_Iv%C3%A1n_Cepeda_%28cropped%29.jpg' },
        { name: 'ESPACIO EN BLANCO', image: '' },
        { name: 'Claudia López', image: 'https://upload.wikimedia.org/wikipedia/commons/c/cf/Claudia_Lopez_H_26.jpg' },
        { name: 'Santiago Botero', image: 'https://img.lalr.co/cms/2022/09/17120032/1280X1440_Santiago-Botero-Jaramillo.jpg' },
        { name: 'Abelardo de la Espriella', image: 'https://img.lalr.co/cms/2017/06/05120948/1280X1440_ABELARDO-DE-LA-ESPRIELLA_IMG_5126.jpg?r=6_5&ns=1' },
        { name: 'Mauricio Lizcano', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Mauricio_Lizcano_2023.jpg/960px-Mauricio_Lizcano_2023.jpg' },
        { name: 'Miguel Uribe Londoño', image: 'https://www.centrodemocratico.com/wp-content/uploads/2025/09/Miguel_Uribe_Londono-1.jpg' },
        { name: 'Sondra Macollins Garvin', image: 'https://upload.wikimedia.org/wikipedia/commons/0/02/Sondra_Macollins_Garvin_Pinto.jpg' },
        { name: 'Roy Barreras', image: 'https://apicongresovisible.uniandes.edu.co/uploads/persona/112/figura-Roy%20Barreras-510px.jpg' },
        { name: 'Carlos Eduardo Caicedo', image: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/Carlos_Caicedo_%28cropped%29.jpg' },
        { name: 'Gustavo Matamoros', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRU2uFW2CviUs6dkELPJL9k0STELeVEud9mAw&s' },
        { name: 'Paloma Valencia', image: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Discurso_Paloma_Valencia.jpg' },
        { name: 'Sergio Fajardo', image: 'https://yt3.googleusercontent.com/jdDwf-yWrKAcDaALsUAG0uyVNxT6C8dp8mjMUWxETjIoa3T3bG1qdOoCk-mIKHNA8Kw8bbrCtPc=s900-c-k-c0x00ffffff-no-rj' },
        { name: 'Luis Gilberto Murillo', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Luis_Gilberto_Murillo_2024.jpg/960px-Luis_Gilberto_Murillo_2024.jpg' },
        { name: 'Voto en Blanco', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfUcDoGXLN1-wR1v9bcbh838FezJT3gITr8w&s' }
      ];

      candidates.forEach((candidate: any) => {
        db.run(
          'INSERT INTO options (poll_id, text, image_url) VALUES (?, ?, ?)',
          [pollId, candidate.name, candidate.image]
        );
      });

      setTimeout(() => {
        console.log('✓ Encuesta presidencial inicializada con 14 candidatos reales + imágenes');
        db.close();
        process.exit(0);
      }, 500);
    }
  );
});
