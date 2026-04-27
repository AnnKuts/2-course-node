import { marked } from 'marked';
import { Request, Response } from 'express';
import { getAllFanfics, getByIdAsync, createAsync, updateAsync, deleteAsync } from '../services/fanficService.ts';
import { getByFanficIdAsync as getCommentsByFanficId } from '../services/commentService.ts';
import { getByPubIdAsync as getReviewsByFanficId } from '../services/reviewService.ts';
import { AuthenticatedRequest } from '../middleware/authMiddleware.ts';
import { getAllUsersSync } from '../repository/userRepo.ts';
import { UUID } from 'node:crypto';

export const getAllFanficsController = (req: Request, res: Response) => {
    try {
        const fanfics = getAllFanfics();
        res.render('index', {
            title: 'Fanfics',
            fanfics
        })
    } catch (error) {
        res.status(500).send('Failed to retrieve fanfics');
    }
}

export const fanficPageController = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const fanfic = await getByIdAsync(id);
    const comments = await getCommentsByFanficId(id as UUID);
    const reviews = await getReviewsByFanficId(id as UUID);

    if (!fanfic) {
        res.status(404).send('Fanfic not found');
        return;
    }

    const users = getAllUsersSync();
    const userMap = new Map(users.map(u => [u.user_id, u.username]));

    const mappedComments = comments.map(c => ({...c, username: userMap.get(c.user_id) || 'Unknown Author'}));
    const mappedReviews = reviews.map(r => ({...r, username: userMap.get(r.user_id) || 'Unknown Author'}));

    let averageRating = 0;
    if (reviews.length > 0) {
        averageRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
    }
    fanfic.rating = averageRating;

    fanfic.description = await marked.parse(fanfic.description);
    fanfic.content = await marked.parse(fanfic.content || '');

    res.render('fanfic', { 
        fanfic,
        comments: mappedComments,
        reviews: mappedReviews
    });
};

export const editorController = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string | undefined;
    let fanfic = null;

    if (id) {
        fanfic = await getByIdAsync(id as string);
        
        if (!fanfic) {
            res.status(404).send('Fanfic not found');
            return;
        }
    }

    res.render('editor', { 
        fanfic: fanfic || { 
            fanfic_id: undefined,
            user_id: '', 
            title: '', 
            description: '', 
            content: '',
            genre: []
        } 
    });
};

export const saveController = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const idFromParams = req.params.id as string | undefined;
    const { title, description, content, genre, restriction, id: idFromBody } = req.body;
    const id = idFromParams || idFromBody;
    const user_id = req.user?.user_id as string;

    if (!title || !description || !content || !user_id || !genre || !restriction) {
        res.status(400).json({ error: 'Missing fields' });
        return;
    }

    try {
        if (id) {
            const existing = await getByIdAsync(id as string);
            if (!existing) {
                res.status(404).json({ error: 'Fanfic not found' });
                return;
            }
            if (existing.user_id !== user_id) {
                res.status(403).json({ error: 'Only author can edit this fanfic' });
                return;
            }
        }

        const fanfic = {
            fanfic_id: (id || Date.now().toString()) as string,
            user_id,
            title,
            description,
            content,
            genre: Array.isArray(genre) ? genre : [genre],
            restriction,
            rating: 0,
            reports: 0
        };

        if (id) {
            await updateAsync(fanfic);
            res.json({ fanfic_id: fanfic.fanfic_id, message: 'Fanfic updated' });
        } else {
            await createAsync(fanfic);
            res.json({ fanfic_id: fanfic.fanfic_id, message: 'Fanfic created' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Save failed' });
    }
};

export const deleteController = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const user_id = req.user?.user_id as string;

    if (!id || !user_id) {
        res.status(400).json({ error: 'Missing parameters or unauthorized' });
        return;
    }

    try {
        const existing = await getByIdAsync(id);
        if (!existing) {
            res.status(404).json({ error: 'Fanfic not found' });
            return;
        }

        if (existing.user_id !== user_id) {
            res.status(403).json({ error: 'Only author can delete this fanfic' });
            return;
        }

        const success = await deleteAsync(id);
        if (success) {
            res.json({ message: 'Fanfic deleted' });
        } else {
            res.status(404).json({ error: 'Fanfic could not be deleted' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Delete failed' });
    }
};