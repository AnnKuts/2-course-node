import { pool } from '../db.ts';
import { randomUUID, UUID } from 'node:crypto';
import { Comment } from '../models/comment.ts';

export const getCommentsByFanficIdAsync = async (fanfic_id: string): Promise<Comment[]> => {
    const result = await pool.query(
        'SELECT * FROM comments WHERE fanfic_id = $1 ORDER BY created_at ASC',
        [fanfic_id]
    );
    return result.rows;
};

export const getCommentByIdAsync = async (comment_id: UUID): Promise<Comment | null> => {
    const result = await pool.query('SELECT * FROM comments WHERE comment_id = $1', [comment_id]);
    return result.rows.length > 0 ? result.rows[0] : null;
};

export const insertCommentAsync = async (
    comment: Omit<Comment, 'comment_id' | 'created_at'>
): Promise<Comment> => {
    const result = await pool.query(
        'INSERT INTO comments (comment_id, fanfic_id, user_id, text, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
        [randomUUID(), comment.fanfic_id, comment.user_id, comment.text]
    );
    return result.rows[0];
};

export const updateCommentAsync = async (comment: Comment): Promise<void> => {
    await pool.query(
        'UPDATE comments SET text = $1 WHERE comment_id = $2',
        [comment.text, comment.comment_id]
    );
};

export const deleteCommentAsync = async (comment_id: UUID): Promise<boolean> => {
    const result = await pool.query('DELETE FROM comments WHERE comment_id = $1', [comment_id]);
    return (result.rowCount ?? 0) > 0;
};
