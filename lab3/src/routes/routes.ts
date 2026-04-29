import express from 'express';
const router = express.Router();
import { getAllFanficsController, editorController, saveController, fanficPageController, deleteController } from '../controllers/fanficController.ts';
import { loginController, meController, registerController } from '../controllers/authController.ts';
import {
	getReviewsByPubController,
	createReviewController,
	updateReviewController,
	deleteReviewController,
} from '../controllers/reviewController.ts';
import {
	getCommentsByFanficController,
	createCommentController,
	updateCommentController,
	deleteCommentController,
} from '../controllers/commentController.ts';
import { authenticateToken } from '../middleware/authMiddleware.ts';

router.get('/', getAllFanficsController);
router.get('/auth/login', (req, res) => res.render('login'));
router.get('/auth/register', (req, res) => res.render('register'));
router.post('/auth/register', registerController);
router.post('/auth/login', loginController);
router.get('/auth/me', authenticateToken, meController);

router.get('/fanfic/editor', editorController);
router.get('/fanfic/editor/:id', editorController);
router.get('/fanfic/:id', fanficPageController);
router.post('/fanfic', authenticateToken, saveController);
router.put('/fanfic/:id', authenticateToken, saveController);
router.delete('/fanfic/:id', authenticateToken, deleteController);

router.get('/review/:pub_id', getReviewsByPubController);
router.post('/review', authenticateToken, createReviewController);
router.put('/review/:id', authenticateToken, updateReviewController);
router.delete('/review/:id', authenticateToken, deleteReviewController);

router.get('/comment/:fanfic_id', getCommentsByFanficController);
router.post('/comment', authenticateToken, createCommentController);
router.put('/comment/:id', authenticateToken, updateCommentController);
router.delete('/comment/:id', authenticateToken, deleteCommentController);

export default router;