import express from 'express';
const router = express.Router();
import { getAllFanficsController, editorController, createController, updateController } from '../controllers/fanficController.ts';
import { registerController, loginController, meController } from '../controllers/authController.ts';
import { authenticateToken } from '../middleware/authMiddleware.ts';

router.get('/', getAllFanficsController);
router.get('/auth/login', (req, res) => res.render('login'));
router.get('/auth/register', (req, res) => res.render('register'));

router.post('/auth/register', registerController);
router.post('/auth/login', loginController);
router.get('/auth/me', authenticateToken, meController);

router.get('/fanfic/editor', editorController);
router.get('/fanfic/editor/:id', editorController);

router.post('/fanfic', express.json(), authenticateToken, createController);
router.put('/fanfic/:id', express.json(), authenticateToken, updateController);

export default router;