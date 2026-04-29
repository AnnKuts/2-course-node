import { pool } from '../db.js';
import { User } from '../models/user.ts';
import { randomUUID } from 'crypto';

export const findUserByEmail = async (email: string): Promise<User | null> => {
    try {
        const result = await pool.query(
            'SELECT user_id, username, email, password, is_admin, is_active FROM users WHERE email = $1',
            [email]
        );
        return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
        console.error('Error finding user by email:', error);
        throw error;
    }
};

export const findUserById = async (user_id: string): Promise<User | null> => {
    try {
        const result = await pool.query(
            'SELECT user_id, username, email, password, is_admin, is_active FROM users WHERE user_id = $1',
            [user_id]
        );
        return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
        console.error('Error finding user by id:', error);
        throw error;
    }
};

export const createUser = async (
    username: string,
    email: string,
    hashedPassword: string
): Promise<User> => {
    const user_id = randomUUID();
    try {
        const result = await pool.query(
            `INSERT INTO users (user_id, username, email, password, is_admin, is_active)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING user_id, username, email, password, is_admin, is_active`,
            [user_id, username, email, hashedPassword, false, true]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};

export const getAllUsers = async (): Promise<User[]> => {
    try {
        const result = await pool.query(
            'SELECT user_id, username, email, password, is_admin, is_active FROM users'
        );
        return result.rows;
    } catch (error) {
        console.error('Error fetching all users:', error);
        throw error;
    }
};
