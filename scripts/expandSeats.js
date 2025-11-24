const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'db.json');

function expandSeatsTo(n = 50) {
  const raw = fs.readFileSync(dbPath, 'utf8');
  const db = JSON.parse(raw);
  if (!Array.isArray(db.movies)) {
    console.error('db.json does not contain movies array');
    process.exit(1);
  }

  db.movies = db.movies.map(movie => {
    const oldSeats = movie.seats || {};
    const newSeats = {};
    for (let i = 1; i <= n; i++) {
      const key = String(i);
      newSeats[key] = !!oldSeats[key];
    }
    return { ...movie, seats: newSeats };
  });

  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
  console.log(`Expanded seats to ${n} for ${db.movies.length} movies in db.json`);
}

const target = parseInt(process.argv[2], 10) || 50;
expandSeatsTo(target);
