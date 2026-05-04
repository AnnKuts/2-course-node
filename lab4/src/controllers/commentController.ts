import { Response } from 'express';
import { UUID } from 'node:crypto';
import {
    getByFanficIdAsync,
    getByIdAsync,
    createAsync,
    updateAsync,
    deleteAsync,
} from '../services/commentService.ts';
import { AuthenticatedRequest } from '../middleware/authMiddleware.ts';

export const getCommentsByFanficController = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    try {
        const fanfic_id = req.params.fanfic_id as string;
        const comments = await getByFanficIdAsync(fanfic_id);
        res.json(comments);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve comments' });
    }
};

export const createCommentController = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    const { fanfic_id, text } = req.body;
    const user_id = req.user?.user_id as UUID | undefined;

    if (!fanfic_id || !text || !user_id) {
        res.status(400).json({ error: 'Missing fields' });
        return;
    }

    if (typeof text !== 'string' || text.trim().length === 0) {
        res.status(422).json({ error: 'Text must be a non-empty string' });
        return;
    }

    try {
        const comment = await createAsync({ fanfic_id, user_id, text: text.trim() });
        res.status(201).json({ comment, message: 'Comment created' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create comment' });
    }
};

export const updateCommentController = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    const comment_id = req.params.id as UUID;
    const { text } = req.body;
    const user_id = req.user?.user_id;

    try {
        const existing = await getByIdAsync(comment_id);
        if (!existing) {
            res.status(404).json({ error: 'Comment not found' });
            return;
        }
        if (existing.user_id !== user_id) {
            res.status(403).json({ error: 'Only author can edit this comment' });
            return;
        }

        if (typeof text !== 'string' || text.trim().length === 0) {
            res.status(422).json({ error: 'Text must be a non-empty string' });
            return;
        }

        const updated = { ...existing, text: text.trim() };
        await updateAsync(updated);
        res.json({ comment: updated, message: 'Comment updated' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update comment' });
    }
};

export const deleteCommentController = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    const comment_id = req.params.id as UUID;
    const user_id = req.user?.user_id;

    try {
        const existing = await getByIdAsync(comment_id);
        if (!existing) {
            res.status(404).json({ error: 'Comment not found' });
            return;
        }
        if (existing.user_id !== user_id) {
            res.status(403).json({ error: 'Only author can delete this comment' });
            return;
        }

        await deleteAsync(comment_id);
        res.json({ message: 'Comment deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete comment' });
    }
};
