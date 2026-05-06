import { pool } from '../db.ts';
import { UUID } from 'node:crypto';
import { Review } from '../models/review.ts';

export const getReviewsByPubIdAsync = async (pub_id: UUID): Promise<Review[]> => {
    const result = await pool.query('SELECT * FROM reviews WHERE pub_id = $1', [pub_id]);
    return result.rows;
};

export const getReviewByIdAsync = async (id: UUID): Promise<Review | null> => {
    const result = await pool.query('SELECT * FROM reviews WHERE id = $1', [id]);
    return result.rows.length > 0 ? result.rows[0] : null;
};

export const insertReviewAsync = async (review: Omit<Review, 'id' | 'created_at'>): Promise<Review> => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const result = await client.query(
            'INSERT INTO reviews (pub_id, user_id, comment, rating) VALUES ($1, $2, $3, $4) RETURNING *',
            [review.pub_id, review.user_id, review.comment, review.rating]
        );
        await client.query('COMMIT');
        return result.rows[0];
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
};

export const updateReviewAsync = async (review: Review): Promise<void> => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        await client.query(
            'UPDATE reviews SET comment = $1, rating = $2 WHERE id = $3',
            [review.comment, review.rating, review.id]
        );
        await client.query('COMMIT');
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
};

export const deleteReviewAsync = async (id: UUID): Promise<boolean> => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const result = await client.query('DELETE FROM reviews WHERE id = $1', [id]);
        await client.query('COMMIT');
        return (result.rowCount ?? 0) > 0;
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
};
