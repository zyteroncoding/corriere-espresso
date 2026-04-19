import { Router, Response } from 'express';
import pool from '../db';
import bcrypt from 'bcrypt';
import { verificaToken, soloAdmin, AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/', verificaToken, soloAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const [rows]: any = await pool.query(
            'SELECT UtenteID, Email, Admin FROM Utente'
        );
        res.json(rows);
    } catch {
        res.status(500).json({ errore: 'Errore del server' });
    }
});

router.post('/', verificaToken, soloAdmin, async (req: AuthRequest, res: Response) => {
    const { email, password, admin } = req.body;

    if (!email || !password) {
        res.status(400).json({ errore: 'Email e password obbligatorie' });
        return;
    }

    try {
        const passwordHash = await bcrypt.hash(password, 10);
        const [result]: any = await pool.query(
            'INSERT INTO Utente (Email, Password, Admin) VALUES (?, ?, ?)',
            [email, passwordHash, admin || false]
        );
        res.status(201).json({ utenteId: result.insertId });
    } catch (err: any) {
        if (err.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ errore: 'Email già in uso' });
            return;
        }
        res.status(500).json({ errore: 'Errore del server' });
    }
});

router.put('/:id', verificaToken, soloAdmin, async (req: AuthRequest, res: Response) => {
    const { email, password, admin } = req.body;

    if (!email) {
        res.status(400).json({ errore: 'Email obbligatoria' });
        return;
    }

    try {
        if (password) {
            const passwordHash = await bcrypt.hash(password, 10);
            await pool.query(
                'UPDATE Utente SET Email=?, Password=?, Admin=? WHERE UtenteID=?',
                [email, passwordHash, admin || false, req.params.id]
            );
        } else {
            await pool.query(
                'UPDATE Utente SET Email=?, Admin=? WHERE UtenteID=?',
                [email, admin || false, req.params.id]
            );
        }
        res.json({ messaggio: 'Utente aggiornato' });
    } catch (err: any) {
        if (err.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ errore: 'Email già in uso' });
            return;
        }
        res.status(500).json({ errore: 'Errore del server' });
    }
});

router.delete('/:id', verificaToken, soloAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const [result]: any = await pool.query(
            'DELETE FROM Utente WHERE UtenteID = ?', [req.params.id]
        );
        if (result.affectedRows === 0) {
            res.status(404).json({ errore: 'Utente non trovato' });
            return;
        }
        res.json({ messaggio: 'Utente eliminato' });
    } catch {
        res.status(500).json({ errore: 'Errore del server' });
    }
});

export default router;