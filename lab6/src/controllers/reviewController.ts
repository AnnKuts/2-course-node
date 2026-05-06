import { Response } from 'express';
import { UUID } from 'node:crypto';
import {
    getByPubIdAsync,
    getByIdAsync,
    createReviewAndUpdateRatingTx,
    updateAsync,
    deleteAsync,
} from '../services/reviewService.ts';
import { updateFanficRatingAsync } from '../services/fanficService.ts';
import { AuthenticatedRequest } from '../middleware/authMiddleware.ts';

export const getReviewsByPubController = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    try {
        const pub_id = req.params.pub_id as UUID;
        const reviews = await getByPubIdAsync(pub_id);
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve reviews' });
    }
};

export const createReviewController = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    const { pub_id, comment, rating } = req.body;
    const user_id = req.user?.user_id as UUID | undefined;

    if (!pub_id || !comment || rating === undefined || !user_id) {
        res.status(400).json({ error: 'Missing fields' });
        return;
    }

    const numericRating = Number(rating);
    if (Number.isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
        res.status(422).json({ error: 'Rating must be a number between 1 and 5' });
        return;
    }

    try {
        const review = await createReviewAndUpdateRatingTx(
            { pub_id: pub_id as UUID, user_id, comment, rating: numericRating },
            false
        );
        res.status(201).json({ review, message: 'Review created' });
    } catch (error) {
        console.error('createReview error:', error);
        res.status(500).json({ error: 'Failed to create review' });
    }
};

export const updateReviewController = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
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
            res.status(403).json({ error: 'Only author can edit this review' });
            return;
        }

        const numericRating = rating !== undefined ? Number(rating) : existing.rating;
        if (Number.isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
            res.status(400).json({ error: 'Rating must be a number between 1 and 5' });
            return;
        }

        const updated = { ...existing, comment: comment ?? existing.comment, rating: numericRating };
        await updateAsync(updated);
        await updateFanficRatingAsync(existing.pub_id);
        res.json({ review: updated, message: 'Review updated' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update review' });
    }
};

export const deleteReviewController = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    const review_id = req.params.id as UUID;
    const user_id = req.user?.user_id;

    try {
        const existing = await getByIdAsync(review_id);
        if (!existing) {
            res.status(404).json({ error: 'Review not found' });
            return;
        }
        if (existing.user_id !== user_id) {
            res.status(403).json({ error: 'Only author can delete this review' });
            return;
        }

        const deleted = await deleteAsync(review_id);
        if (!deleted) {
            res.status(404).json({ error: 'Review not found' });
            return;
        }
        await updateFanficRatingAsync(existing.pub_id);
        res.json({ message: 'Review deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete review' });
    }
};
