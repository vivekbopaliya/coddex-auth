import express from 'express';
import axios from 'axios';

const router = express.Router();

export default (QUARKUS_URL) => {
  // User status
  router.get('/status', req.requireAuth, async (req, res) => {
    try {
      const response = await axios.get(`${QUARKUS_URL}/api/user/${req.user.userId}`, {
        validateStatus: () => true
      });
      if (response.status === 200 && response.data && response.data.success) {
        const user = response.data.data;
        const message = user.emailVerified 
          ? "Your email is validated. You can access the portal" 
          : "You need to validate your email to access the portal";
        res.status(200).json({
          success: true,
          message: message,
          emailVerified: user.emailVerified,
          email: user.email
        });
      } else {
        res.status(response.status).json(response.data);
      }
    } catch (err) {
      console.error('User status proxy error:', err);
      res.status(500).json({ error: 'Proxy error' });
    }
  });
  return router;
};
