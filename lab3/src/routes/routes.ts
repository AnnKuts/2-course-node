import express from 'express';
const router = express.Router();
import { getAllFanficsController } from '../controllers/controller.ts';
import { loginController, meController, registerController } from '../controllers/authController.ts';
import { authenticateToken } from '../middleware/authMiddleware.ts';

router.get('/', getAllFanficsController);
router.post('/auth/register', registerController);
router.post('/auth/login', loginController);
router.get('/auth/me', authenticateToken, meController);

export default router;