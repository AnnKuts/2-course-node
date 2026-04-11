import fsPromises from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { randomUUID, UUID } from 'node:crypto';
import { Comment } from '../models/comment.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, '../../data/comment.json');

export const getAllCommentsAsync = async (): Promise<Comment[]> => {
    try {
        const data = await fsPromises.readFile(dataPath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

export const getCommentsByFanficIdAsync = async (fanfic_id: string): Promise<Comment[]> => {
    const comments = await getAllCommentsAsync();
    return comments.filter(c => c.fanfic_id === fanfic_id);
};

export const getCommentByIdAsync = async (comment_id: UUID): Promise<Comment | null> => {
    const comments = await getAllCommentsAsync();
    return comments.find(c => c.comment_id === comment_id) || null;
};

export const insertCommentAsync = async (
    comment: Omit<Comment, 'comment_id' | 'created_at'>
): Promise<Comment> => {
    const comments = await getAllCommentsAsync();
    const created: Comment = {
        comment_id: randomUUID(),
        created_at: new Date().toISOString(),
        ...comment,
    };
    comments.push(created);
    await fsPromises.writeFile(dataPath, JSON.stringify(comments, null, 2));
    return created;
};

export const updateCommentAsync = async (comment: Comment): Promise<void> => {
    const comments = await getAllCommentsAsync();
    const index = comments.findIndex(c => c.comment_id === comment.comment_id);

    if (index > -1) {
        comments[index] = comment;
    } else {
        comments.push(comment);
    }

    await fsPromises.writeFile(dataPath, JSON.stringify(comments, null, 2));
};

export const deleteCommentAsync = async (comment_id: UUID): Promise<boolean> => {
    const comments = await getAllCommentsAsync();
    const filtered = comments.filter(c => c.comment_id !== comment_id);

    if (filtered.length === comments.length) {
        return false;
    }

    await fsPromises.writeFile(dataPath, JSON.stringify(filtered, null, 2));
    return true;
};
