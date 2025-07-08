import express from 'express';
import axios from 'axios';

const router = express.Router();

export default (QUARKUS_URL) => {
  router.post('/signup', async (req, res) => {
    try {

      console.log("HELLo")
      const response = await axios.post(`${QUARKUS_URL}/api/signup`, req.body, {
        headers: { 'Content-Type': 'application/json' },
        validateStatus: () => true
      });
      res.status(response.status).json(response.data);
    } catch (err) {
      console.error('Signup proxy error:', err);
      res.status(500).json({ error: 'Proxy error' });
    }
  });

  router.post('/verify-email/:token', async (req, res) => {
    const token = req.params.token;
    console.log("TOKEN", token);
    try {
      const response = await axios.get(`${QUARKUS_URL}/api/verify?token=${encodeURIComponent(token)}`, {
        validateStatus: () => true
      });
      res.status(response.status).json(response.data);
    } catch (err) {
      console.error('Email verification proxy error:', err);
      res.status(500).json({ message: 'Internal Server Error', success: false });
    }
  });

  return router;
};
