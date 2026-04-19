import { Router, Request, Response } from 'express';
import pool from '../db';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
    const { chiaveConsegna, dataRitiro } = req.query;

    if (!chiaveConsegna || !dataRitiro) {
        res.status(400).json({ errore: 'chiaveConsegna e dataRitiro sono obbligatori' });
        return;
    }

    try {
        const [rows]: any = await pool.query(
            'SELECT Stato, DataRitiro, DataConsegna FROM Consegna WHERE ChiaveConsegna = ? AND DataRitiro = ?',
            [chiaveConsegna, dataRitiro]
        );

        if (rows.length === 0) {
            res.status(404).json({ errore: 'Consegna non trovata' });
            return;
        }

        res.json(rows[0]);
    } catch {
        res.status(500).json({ errore: 'Errore del server' });
    }
});

export default router;