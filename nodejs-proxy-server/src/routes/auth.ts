import express, { Request, Response } from 'express';

const router = express.Router();

export default (QUARKUS_URL: string) => {

  router.post('/logout', (req: Request, res: Response) => {
    res.clearCookie('session_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  });

  router.get('/check',  (req: Request, res: Response) => {
    res.status(200).json({ 
      success: true, 
      authenticated: true,
      user: (req as any).user
    });
  });

  return router;
}; 