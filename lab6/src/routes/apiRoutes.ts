import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware.ts';

import {
    renderHomeController,
    listFanficsController,
    getFanficController,
    createFanficController,
    updateFanficController,
    deleteFanficController,
} from '../controllers/api/fanficApiController.ts';

import {
    listReviewsController,
    createReviewController,
    updateReviewController,
    deleteReviewController,
} from '../controllers/api/reviewApiController.ts';

import {
    listCommentsController,
    createCommentController,
    updateCommentController,
    deleteCommentController,
} from '../controllers/api/commentApiController.ts';

import {
    registerController,
    loginController,
    meController,
    logoutController,
} from '../controllers/api/authApiController.ts';

const router = Router();

router.get('/', renderHomeController);

router.get('/auth/login', (_req, res) => res.render('login'));
router.get('/auth/register', (_req, res) => res.render('register'));
router.post('/auth/register', registerController);
router.post('/auth/login', loginController);
router.get('/auth/me', authenticateToken, meController);
router.post('/auth/logout', logoutController);

router.get('/fanfics', listFanficsController);
router.get('/fanfics/:id',  getFanficController);
router.post('/fanfics',     authenticateToken, createFanficController);
router.put('/fanfics/:id',  authenticateToken, updateFanficController);
router.delete('/fanfics/:id', authenticateToken, deleteFanficController);

router.get('/fanfics/:id/reviews', listReviewsController);
router.post('/reviews',            authenticateToken, createReviewController);
router.put('/reviews/:id',         authenticateToken, updateReviewController);
router.delete('/reviews/:id',      authenticateToken, deleteReviewController);

router.get('/fanfics/:id/comments', listCommentsController);
router.post('/comments',            authenticateToken, createCommentController);
router.put('/comments/:id',         authenticateToken, updateCommentController);
router.delete('/comments/:id',      authenticateToken, deleteCommentController);

export default router;
