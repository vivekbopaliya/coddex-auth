import { verifyToken } from '../utils/jwt.js';

export function requireAuth(req, res, next) {
  const token = req.cookies.session_token;
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ error: 'Invalid token' });
  }
  req.user = decoded;
  next();
}
