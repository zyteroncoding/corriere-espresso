import { Router, Response } from 'express';
import pool from '../db';
import { verificaToken, AuthRequest } from '../middleware/auth';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

router.get('/', verificaToken, async (req: AuthRequest, res: Response) => {
    try {
        let query = 'SELECT c.*, cl.Nominativo FROM Consegna c JOIN Cliente cl ON c.ClienteID = cl.ClienteID WHERE 1=1';
        const params: any[] = [];

        if (req.query.stato) {
            query += ' AND c.Stato = ?';
            params.push(req.query.stato);
        }
        if (req.query.clienteId) {
            query += ' AND c.ClienteID = ?';
            params.push(req.query.clienteId);
        }

        const [rows]: any = await pool.query(query, params);
        res.json(rows);
    } catch {
        res.status(500).json({ errore: 'Errore del server' });
    }
});

router.get('/:id', verificaToken, async (req: AuthRequest, res: Response) => {
    try {
        const [rows]: any = await pool.query(
            'SELECT c.*, cl.Nominativo FROM Consegna c JOIN Cliente cl ON c.ClienteID = cl.ClienteID WHERE c.ConsegnaID = ?',
            [req.params.id]
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

router.post('/', verificaToken, async (req: AuthRequest, res: Response) => {
    const { clienteId, dataRitiro, stato } = req.body;

    if (!clienteId || !dataRitiro) {
        res.status(400).json({ errore: 'ClienteID e dataRitiro sono obbligatori' });
        return;
    }

    const statiValidi = ['da ritirare', 'in deposito', 'in consegna', 'consegnato', 'in giacenza'];
    if (stato && !statiValidi.includes(stato)) {
        res.status(400).json({ errore: 'Stato non valido' });
        return;
    }

    try {
        const chiaveConsegna = uuidv4().substring(0, 8).toUpperCase();

        const [result]: any = await pool.query(
            'INSERT INTO Consegna (ClienteID, DataRitiro, Stato, ChiaveConsegna) VALUES (?, ?, ?, ?)',
            [clienteId, dataRitiro, stato || 'da ritirare', chiaveConsegna]
        );
        res.status(201).json({ consegnaId: result.insertId, chiaveConsegna });
    } catch {
        res.status(500).json({ errore: 'Errore del server' });
    }
});

router.put('/:id', verificaToken, async (req: AuthRequest, res: Response) => {
    const { clienteId, dataRitiro, dataConsegna, stato } = req.body;

    const statiValidi = ['da ritirare', 'in deposito', 'in consegna', 'consegnato', 'in giacenza'];
    if (stato && !statiValidi.includes(stato)) {
        res.status(400).json({ errore: 'Stato non valido' });
        return;
    }

    try {
        const [result]: any = await pool.query(
            'UPDATE Consegna SET ClienteID=?, DataRitiro=?, DataConsegna=?, Stato=? WHERE ConsegnaID=?',
            [clienteId, dataRitiro, dataConsegna || null, stato, req.params.id]
        );
        if (result.affectedRows === 0) {
            res.status(404).json({ errore: 'Consegna non trovata' });
            return;
        }
        res.json({ messaggio: 'Consegna aggiornata' });
    } catch {
        res.status(500).json({ errore: 'Errore del server' });
    }
});

router.delete('/:id', verificaToken, async (req: AuthRequest, res: Response) => {
    try {
        const [result]: any = await pool.query(
            'DELETE FROM Consegna WHERE ConsegnaID = ?', [req.params.id]
        );
        if (result.affectedRows === 0) {
            res.status(404).json({ errore: 'Consegna non trovata' });
            return;
        }
        res.json({ messaggio: 'Consegna eliminata' });
    } catch {
        res.status(500).json({ errore: 'Errore del server' });
    }
});

export default router;