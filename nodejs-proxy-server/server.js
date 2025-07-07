import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import { requireAuth } from './src/middleware/requireAuth.js';
import authRoutes from './src/routes/auth.js';
import userRoutes from './src/routes/user.js';
import publicRoutes from './src/routes/public.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const QUARKUS_URL = process.env.QUARKUS_URL || 'http://localhost:8080';

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use((req, res, next) => {
  req.requireAuth = (req2, res2, next2) => requireAuth(req2, res2, next2);
  next();
});

app.use('/api', publicRoutes(QUARKUS_URL));
app.use('/api/auth', authRoutes(QUARKUS_URL));
app.use('/api/user', userRoutes(QUARKUS_URL));

app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Proxy server is running' });
});

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
  console.log(`Proxying requests to Quarkus at ${QUARKUS_URL}`);
});