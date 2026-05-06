import { UUID } from 'node:crypto';
import { Review } from '../models/review.ts';
import {
    getReviewsByPubIdAsync,
    getReviewByIdAsync,
    insertReviewAsync,
    updateReviewAsync,
    deleteReviewAsync,
} from '../repository/reviewRepo.ts';

export const getByPubIdAsync = async (pub_id: UUID): Promise<Review[]> => {
    return await getReviewsByPubIdAsync(pub_id);
};

export const getByIdAsync = async (id: UUID): Promise<Review | null> => {
    return await getReviewByIdAsync(id);
};

export const createAsync = async (review: Omit<Review, 'review_id' | 'created_at'>): Promise<Review> => {
    return await insertReviewAsync(review);
};

export const updateAsync = async (review: Review): Promise<void> => {
    await updateReviewAsync(review);
};

export const deleteAsync = async (id: UUID): Promise<boolean> => {
    return await deleteReviewAsync(id);
};
