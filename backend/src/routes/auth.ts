import { Router, Request, Response } from 'express';
import pool from '../db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = Router();

router.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ errore: 'Email e password obbligatorie' });
        return;
    }

    try {
        const [rows]: any = await pool.query(
            'SELECT * FROM Utente WHERE Email = ?', [email]
        );

        if (rows.length === 0) {
            res.status(401).json({ errore: 'Credenziali non valide' });
            return;
        }

        const utente = rows[0];
        const passwordOk = await bcrypt.compare(password, utente.Password);

        if (!passwordOk) {
            res.status(401).json({ errore: 'Credenziali non valide' });
            return;
        }

        const token = jwt.sign(
            { utenteId: utente.UtenteID, email: utente.Email, admin: utente.Admin },
            process.env.JWT_SECRET as string,
            { expiresIn: '8h' }
        );

        res.json({ token, admin: utente.Admin });

    } catch (err) {
        res.status(500).json({ errore: 'Errore del server' });
    }
});

export default router;