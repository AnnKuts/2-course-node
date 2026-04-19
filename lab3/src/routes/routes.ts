import express from 'express';
const router = express.Router();
import { getAllFanficsController, editorController, saveController } from '../controllers/fanficController.ts';
import { loginController, meController, registerController } from '../controllers/authController.ts';
import { authenticateToken } from '../middleware/authMiddleware.ts';

router.get('/', getAllFanficsController);
router.post('/auth/register', registerController);
router.post('/auth/login', loginController);
router.get('/auth/me', authenticateToken, meController);

router.get('/fanfic/editor', editorController);
router.get('/fanfic/editor/:id', editorController);
router.post('/fanfic', authenticateToken, saveController);
router.put('/fanfic/:id', authenticateToken, saveController);

export default router;