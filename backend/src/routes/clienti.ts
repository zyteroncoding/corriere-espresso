import { Router, Response } from 'express';
import pool from '../db';
import { verificaToken, AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/', verificaToken, async (req: AuthRequest, res: Response) => {
    try {
        const [rows]: any = await pool.query('SELECT * FROM Cliente');
        res.json(rows);
    } catch {
        res.status(500).json({ errore: 'Errore del server' });
    }
});

router.get('/:id', verificaToken, async (req: AuthRequest, res: Response) => {
    try {
        const [rows]: any = await pool.query(
            'SELECT * FROM Cliente WHERE ClienteID = ?', [req.params.id]
        );
        if (rows.length === 0) {
            res.status(404).json({ errore: 'Cliente non trovato' });
            return;
        }
        res.json(rows[0]);
    } catch {
        res.status(500).json({ errore: 'Errore del server' });
    }
});

router.post('/', verificaToken, async (req: AuthRequest, res: Response) => {
    const { nominativo, via, comune, provincia, telefono, email, note } = req.body;

    if (!nominativo || !via) {
        res.status(400).json({ errore: 'Nominativo e via sono obbligatori' });
        return;
    }

    try {
        const [result]: any = await pool.query(
            'INSERT INTO Cliente (Nominativo, Via, Comune, Provincia, Telefono, Email, Note) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [nominativo, via, comune, provincia, telefono, email, note]
        );
        res.status(201).json({ clienteId: result.insertId });
    } catch {
        res.status(500).json({ errore: 'Errore del server' });
    }
});

router.put('/:id', verificaToken, async (req: AuthRequest, res: Response) => {
    const { nominativo, via, comune, provincia, telefono, email, note } = req.body;

    if (!nominativo || !via) {
        res.status(400).json({ errore: 'Nominativo e via sono obbligatori' });
        return;
    }

    try {
        const [result]: any = await pool.query(
            'UPDATE Cliente SET Nominativo=?, Via=?, Comune=?, Provincia=?, Telefono=?, Email=?, Note=? WHERE ClienteID=?',
            [nominativo, via, comune, provincia, telefono, email, note, req.params.id]
        );
        if (result.affectedRows === 0) {
            res.status(404).json({ errore: 'Cliente non trovato' });
            return;
        }
        res.json({ messaggio: 'Cliente aggiornato' });
    } catch {
        res.status(500).json({ errore: 'Errore del server' });
    }
});

router.delete('/:id', verificaToken, async (req: AuthRequest, res: Response) => {
    try {
        const [consegne]: any = await pool.query(
            'SELECT * FROM Consegna WHERE ClienteID = ?', [req.params.id]
        );
        if (consegne.length > 0) {
            res.status(400).json({ errore: 'Cliente non eliminabile: ha consegne associate' });
            return;
        }

        const [result]: any = await pool.query(
            'DELETE FROM Cliente WHERE ClienteID = ?', [req.params.id]
        );
        if (result.affectedRows === 0) {
            res.status(404).json({ errore: 'Cliente non trovato' });
            return;
        }
        res.json({ messaggio: 'Cliente eliminato' });
    } catch {
        res.status(500).json({ errore: 'Errore del server' });
    }
});

export default router;