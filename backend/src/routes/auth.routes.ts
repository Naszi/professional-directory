import { Router, Request, Response } from 'express';
import { register, login, getMe } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/register', async (req: Request, res: Response) => {
    await register(req, res);
});
router.post('/login', async (req: Request, res: Response) => {
    await login(req, res);
});
router.get('/me', authMiddleware, getMe);

export default router;
