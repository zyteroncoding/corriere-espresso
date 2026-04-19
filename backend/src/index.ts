import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth';
import clientiRoutes from './routes/clienti';
import consegneRoutes from './routes/consegne';
import utentiRoutes from './routes/utenti';
import trackingRoutes from './routes/tracking';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.json({ messaggio: 'Server Corriere Espresso attivo!' });
});

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/clienti', clientiRoutes);
app.use('/consegne', consegneRoutes);
app.use('/utenti', utentiRoutes);
app.use('/tracking', trackingRoutes);

app.listen(PORT, () => {
    console.log(`Server in ascolto su http://localhost:${PORT}`);
});