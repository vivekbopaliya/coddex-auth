import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import publicRoutes from './routes/public';
import { requireAuth } from './middleware/requireAuth';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const QUARKUS_URL = process.env.QUARKUS_URL || 'http://localhost:8080';

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use('/api', publicRoutes(QUARKUS_URL));
app.use('/api/auth', requireAuth, authRoutes(QUARKUS_URL));
app.use('/api/user', userRoutes(QUARKUS_URL));

app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: 'Proxy server is running' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Proxy server running on port ${PORT}`);
});