import { Response } from 'express';
import { UUID } from 'node:crypto';
import {
    getByPubIdAsync,
    getByIdAsync,
    createReviewAndUpdateRatingTx,
    updateAsync,
    deleteAsync,
} from '../../services/reviewService.ts';
import { updateFanficRatingAsync } from '../../services/fanficService.ts';
import { AuthenticatedRequest } from '../../middleware/authMiddleware.ts';

/** GET /api/v1/fanfics/:id/reviews */
export const listReviewsController = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const reviews = await getByPubIdAsync(req.params.id as UUID);
        res.status(200).json({ data: reviews });
    } catch {
        res.status(500).json({ error: 'Failed to retrieve reviews' });
    }
};

/** POST /api/v1/reviews */
export const createReviewController = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { pub_id, comment, rating } = req.body;
    const user_id = req.user?.user_id as UUID | undefined;

    if (!pub_id || !comment || rating === undefined || !user_id) {
        res.status(400).json({ error: 'pub_id, comment, rating and auth token are required' });
        return;
    }
    const numericRating = Number(rating);
    if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
        res.status(422).json({ error: 'rating must be a number between 1 and 5' });
        return;
    }

    try {
        const review = await createReviewAndUpdateRatingTx(
            { pub_id: pub_id as UUID, user_id, comment, rating: numericRating },
            false
        );
        res.status(201).json({ data: review, message: 'Review created' });
    } catch {
        res.status(500).json({ error: 'Failed to create review' });
    }
};

/** PUT /api/v1/reviews/:id */
export const updateReviewController = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const review_id = req.params.id as UUID;
    const { comment, rating } = req.body;
    const user_id = req.user?.user_id;

    try {
        const existing = await getByIdAsync(review_id);
        if (!existing) {
            res.status(404).json({ error: 'Review not found' });
            return;
        }
        if (existing.user_id !== user_id) {
            res.status(403).json({ error: 'Only the author can edit this review' });
            return;
        }
        const numericRating = rating !== undefined ? Number(rating) : existing.rating;
        if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
            res.status(422).json({ error: 'rating must be a number between 1 and 5' });
            return;
        }
        const updated = { ...existing, comment: comment ?? existing.comment, rating: numericRating };
        await updateAsync(updated);
        await updateFanficRatingAsync(existing.pub_id);
        res.status(200).json({ data: updated, message: 'Review updated' });
    } catch {
        res.status(500).json({ error: 'Failed to update review' });
    }
};

/** DELETE /api/v1/reviews/:id */
export const deleteReviewController = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const review_id = req.params.id as UUID;
    const user_id = req.user?.user_id;

    try {
        const existing = await getByIdAsync(review_id);
        if (!existing) {
            res.status(404).json({ error: 'Review not found' });
            return;
        }
        if (existing.user_id !== user_id) {
            res.status(403).json({ error: 'Only the author can delete this review' });
            return;
        }
        await deleteAsync(review_id);
        await updateFanficRatingAsync(existing.pub_id);
        res.status(200).json({ message: 'Review deleted' });
    } catch {
        res.status(500).json({ error: 'Failed to delete review' });
    }
};
