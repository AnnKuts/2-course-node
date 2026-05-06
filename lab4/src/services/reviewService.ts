import { UUID } from 'node:crypto';
import { Review } from '../models/review.ts';
import { pool } from '../db.ts';
import {
    getReviewsByPubIdAsync,
    getReviewByIdAsync,
    updateReviewAsync,
    deleteReviewAsync,
} from '../repository/reviewRepo.ts';

export const getByPubIdAsync = async (pub_id: UUID): Promise<Review[]> => {
    return await getReviewsByPubIdAsync(pub_id);
};

export const getByIdAsync = async (id: UUID): Promise<Review | null> => {
    return await getReviewByIdAsync(id);
};

export const updateAsync = async (review: Review): Promise<void> => {
    await updateReviewAsync(review);
};

export const deleteAsync = async (id: UUID): Promise<boolean> => {
    return await deleteReviewAsync(id);
};

// forceFail - прапорець завдяки якому навмисне фейлимо транзакцію за потреби.
export const createReviewAndUpdateRatingTx = async (
    input: Omit<Review, 'review_id' | 'created_at'>,
    forceFail: boolean = false
): Promise<Review> => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const inserted = await client.query(
            'INSERT INTO reviews (pub_id, user_id, comment, rating) VALUES ($1, $2, $3, $4) RETURNING *',
            [input.pub_id, input.user_id, input.comment, input.rating]
        );
        const review = inserted.rows[0] as Review;

        if (forceFail) {
            throw new Error('Forced failure to demonstrate transaction rollback');
        }

        const avgRes = await client.query(
            'SELECT AVG(rating)::float8 AS avg_rating FROM reviews WHERE pub_id = $1',
            [input.pub_id]
        );
        const averageRating = Number(avgRes.rows[0]?.avg_rating ?? 0);

        await client.query(
            'UPDATE fanfics SET rating = $1 WHERE fanfic_id = $2',
            [averageRating, input.pub_id]
        );

        await client.query('COMMIT');
        return review;
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
};
