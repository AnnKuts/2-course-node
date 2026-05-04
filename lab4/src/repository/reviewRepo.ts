import { pool } from '../db.ts';
import { UUID } from 'node:crypto';
import { Review } from '../models/review.ts';

export const getReviewsByPubIdAsync = async (pub_id: UUID): Promise<Review[]> => {
    const result = await pool.query('SELECT * FROM review WHERE pub_id = $1', [pub_id]);
    return result.rows;
};

export const getReviewByIdAsync = async (id: UUID): Promise<Review | null> => {
    const result = await pool.query('SELECT * FROM review WHERE id = $1', [id]);
    return result.rows.length > 0 ? result.rows[0] : null;
};

export const insertReviewAsync = async (review: Omit<Review, 'id' | 'created_at'>): Promise<Review> => {
    const result = await pool.query(
        'INSERT INTO review (pub_id, user_id, comment, rating) VALUES ($1, $2, $3, $4) RETURNING *',
        [review.pub_id, review.user_id, review.comment, review.rating]
    );
    return result.rows[0];
};

export const updateReviewAsync = async (review: Review): Promise<void> => {
    await pool.query(
        'UPDATE review SET comment = $1, rating = $2 WHERE id = $3',
        [review.comment, review.rating, review.id]
    );
};

export const deleteReviewAsync = async (id: UUID): Promise<boolean> => {
    const result = await pool.query('DELETE FROM review WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
};
