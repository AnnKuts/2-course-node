import fs from 'fs';
import fsPromises from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { randomUUID, UUID } from 'node:crypto';
import { Comment } from '../models/comment.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, '../../data/comment.json');

export const getAllCommentsSync = (): Comment[] => {
    try {
        const data = fs.readFileSync(dataPath, 'utf-8');
        return JSON.parse(data) as Comment[];
    } catch (error) {
        return [];
    }
};

export const getAllCommentsCallback = (
    callback: (err: NodeJS.ErrnoException | null, comments: Comment[]) => void
): void => {
    fs.readFile(dataPath, 'utf-8', (err, data) => {
        if (err) {
            return callback(null, []);
        }
        try {
            callback(null, JSON.parse(data) as Comment[]);
        } catch (parseErr) {
            callback(parseErr as NodeJS.ErrnoException, []);
        }
    });
};

export const getAllCommentsPromise = (): Promise<Comment[]> => {
    return fsPromises
        .readFile(dataPath, 'utf-8')
        .then((data) => JSON.parse(data) as Comment[])
        .catch(() => []);
};

export const getAllCommentsAsync = async (): Promise<Comment[]> => {
    try {
        const data = await fsPromises.readFile(dataPath, 'utf-8');
        return JSON.parse(data) as Comment[];
    } catch (error) {
        return [];
    }
};

export const getCommentsByFanficIdAsync = (fanfic_id: string): Promise<Comment[]> => {
    return getAllCommentsPromise().then((comments) =>
        comments.filter((c) => c.fanfic_id === fanfic_id)
    );
};

export const getCommentByIdAsync = (comment_id: UUID): Promise<Comment | null> => {
    return new Promise((resolve) => {
        getAllCommentsCallback((_err, comments) => {
            resolve(comments.find((c) => c.comment_id === comment_id) || null);
        });
    });
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
    const index = comments.findIndex((c) => c.comment_id === comment.comment_id);

    if (index > -1) {
        comments[index] = comment;
    } else {
        comments.push(comment);
    }

    await fsPromises.writeFile(dataPath, JSON.stringify(comments, null, 2));
};

export const deleteCommentAsync = async (comment_id: UUID): Promise<boolean> => {
    const comments = getAllCommentsSync();
    const filtered = comments.filter((c) => c.comment_id !== comment_id);

    if (filtered.length === comments.length) {
        return false;
    }

    await fsPromises.writeFile(dataPath, JSON.stringify(filtered, null, 2));
    return true;
};
