import bcrypt from 'bcrypt';
import pool from './db';

async function seed() {
    const passwordHash = await bcrypt.hash('admin123', 10);

    await pool.query(
        'INSERT INTO Utente (Email, Password, Admin) VALUES (?, ?, ?)',
        ['admin@corriere.it', passwordHash, true]
    );

    console.log('Admin creato con successo!');
    process.exit(0);
}

seed().catch(console.error);