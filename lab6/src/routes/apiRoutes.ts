import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware.ts';

import {
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

const router = Router();

// ─── Fanfics (повний CRUD + фільтрація/пагінація) ────────────────────────────
// GET  /api/v1/fanfics?page=1&limit=10&genre=fantasy&restriction=0+&minRating=3&search=title
router.get('/fanfics',      listFanficsController);
router.get('/fanfics/:id',  getFanficController);
router.post('/fanfics',     authenticateToken, createFanficController);
router.put('/fanfics/:id',  authenticateToken, updateFanficController);
router.delete('/fanfics/:id', authenticateToken, deleteFanficController);

// ─── Reviews ─────────────────────────────────────────────────────────────────
router.get('/fanfics/:id/reviews', listReviewsController);
router.post('/reviews',            authenticateToken, createReviewController);
router.put('/reviews/:id',         authenticateToken, updateReviewController);
router.delete('/reviews/:id',      authenticateToken, deleteReviewController);

// ─── Comments ────────────────────────────────────────────────────────────────
router.get('/fanfics/:id/comments', listCommentsController);
router.post('/comments',            authenticateToken, createCommentController);
router.put('/comments/:id',         authenticateToken, updateCommentController);
router.delete('/comments/:id',      authenticateToken, deleteCommentController);

export default router;
