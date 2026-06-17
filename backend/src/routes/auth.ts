import express, { Request, Response } from 'express';
import { authController } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.post('/register', async (req: Request, res: Response) => {
  try {
    const result = await authController.register(req.body);
    res.status(201).json(result);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Missing required fields')) {
      return res.status(400).json({ error: error.message });
    }
    if (error instanceof Error && error.message.includes('Invalid credentials')) {
      return res.status(401).json({ error: error.message });
    }
    if (error instanceof Error && error.message.includes('Failed to create user profile')) {
      return res.status(500).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const result = await authController.login(req.body.email, req.body.password);
    res.json(result);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Invalid credentials')) {
      return res.status(401).json({ error: error.message });
    }
    if (error instanceof Error && error.message.includes('Failed to fetch user profile')) {
      return res.status(500).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/logout', authenticateToken, async (req: Request, res: Response) => {
  try {
    const result = await authController.logout();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/me', authenticateToken, async (req: Request, res: Response) => {
  try {
    const result = await authController.getCurrentUser(req.user.userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
