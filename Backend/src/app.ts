import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';

import rollRoutes from './routes/roll.routes';
import diceRoutes from './routes/dice.routes';
import { limiter, requireJson, notFound, errorHandler } from './middlewares';

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173' }));
app.use(limiter);
app.use(morgan('dev'));
app.use(express.json({ limit: '10kb' }));
app.use(requireJson);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/dice', diceRoutes);
app.use('/rolls', rollRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
