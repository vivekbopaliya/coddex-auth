import express from 'express';
import axios from 'axios';
import { generateToken } from '../utils/jwt.js';

const router = express.Router();

export default (QUARKUS_URL) => {
  router.post('/login', async (req, res) => {
    try {
      const response = await axios.post(`${QUARKUS_URL}/api/login`, req.body, {
        headers: { 'Content-Type': 'application/json' },
        validateStatus: () => true
      });
      if (response.status === 200 && response.data && response.data.success && response.data.data) {
        const user = response.data.data;
        const token = generateToken(user);
        res.cookie('session_token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 7 * 24 * 60 * 60 * 1000
        });
        const message = user.emailVerified 
          ? "Your email is validated. You can access the portal" 
          : "You need to validate your email to access the portal";
        res.status(200).json({ 
          success: true, 
          message: message,
          emailVerified: user.emailVerified 
        });
      } else {
        res.status(response.status).json(response.data);
      }
    } catch (err) {
      console.error('Login proxy error:', err);
      res.status(500).json({ error: 'Proxy error' });
    }
  });

  router.post('/logout', (req, res) => {
    res.clearCookie('session_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  });

  router.get('/check', req.requireAuth, (req, res) => {
    res.status(200).json({ 
      success: true, 
      authenticated: true,
      user: req.user
    });
  });

  return router;
};
