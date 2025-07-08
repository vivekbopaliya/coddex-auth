import express from 'express';
import axios from 'axios';
import { requireAuth } from '../middleware/requireAuth.js';

const router = express.Router();

export default (QUARKUS_URL) => {
  router.get('/status', requireAuth, async (req, res) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'User not authenticated' });
      }

      const response = await axios.get(`${QUARKUS_URL}/api/check-status/${userId}`, {
        validateStatus: () => true
      });

      console.log("response", response.data)

      if (response.status === 200 && response.data && response.data.success) {
        res.status(200).json(response.data);
      } else {
        res.status(response.status).json(response.data);
      }
    } catch (err) {
      console.error('User status proxy error:', err);
      res.status(500).json({ message: 'Proxy error', success: false });
    }
  });

  return router;
};
