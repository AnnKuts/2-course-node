import { marked } from 'marked';
import { getAllFanfics, getByIdAsync, createAsync, updateAsync, deleteAsync, checkTitleUnique } from '../services/fanficService.ts';
import { getById } from '../repository/fanficRepository.ts';
import { getByFanficIdAsync as getCommentsByFanficId } from '../services/commentService.ts';
import { getByPubIdAsync as getReviewsByFanficId } from '../services/reviewService.ts';
import { getAllUsersServiceAsync } from '../services/userService.ts';
import { AuthenticatedRequest } from '../middleware/authMiddleware.ts';
import { Request, Response } from 'express';
import { UUID } from 'node:crypto';

export const getAllFanficsController = async (req: Request, res: Response) => {
    try {
        const fanfics = await getAllFanfics();
        res.render('index', {
            title: 'Fanfics',
            fanfics
        });
    } catch (error) {
        console.log("retrieving fanfics: ", error);
        res.status(500).send('Failed to retrieve fanfics');
    }
};

export const editorController = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string | undefined;
    let fanfic = null;
    if (id) {
        fanfic = await getByIdAsync(id);
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
            genre: '',
            restriction: '0+',
            rating: 0,
            reports: 0
        } 
    });
};

export const createController = async (req: Request, res: Response): Promise<void> => {
    const { title, genre } = req.body;
    const user = (req as any).user;
    if (!title || typeof title !== 'string' || title.trim().length < 3) {
        res.status(400).json({ error: 'Title must be at least 3 characters' });
        return;
    }
    if (!genre) {
        res.status(400).json({ error: 'Missing genre field' });
        return;
    }
    if (!user || !user.user_id) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    const isUnique = await checkTitleUnique(title);
    if (!isUnique) {
        res.status(400).json({ error: 'Fanfic with this title already exists' });
        return;
    }
    const newId = await createAsync({ ...req.body, user_id: user.user_id });
    res.status(201).json({ fanfic_id: newId, message: 'Fanfic created' });
};

export const fanficPageController = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;

    const [fanfic, comments, reviews, users] = await Promise.all([
        getByIdAsync(id),
        getCommentsByFanficId(id),
        getReviewsByFanficId(id as UUID),
        getAllUsersServiceAsync(),
    ]);

    if (!fanfic) {
        res.status(404).send('Fanfic not found');
        return;
    }

    const userMap = new Map(users.map(u => [u.user_id, u.username]));
    const mappedComments = comments.map(c => ({ ...c, username: userMap.get(c.user_id) || 'Unknown Author' }));
    const mappedReviews = reviews.map(r => ({ ...r, username: userMap.get(r.user_id) || 'Unknown Author' }));

    fanfic.description = await marked.parse(fanfic.description ?? '');
    fanfic.content = await marked.parse(fanfic.content || '');

    res.render('fanfic', { fanfic, comments: mappedComments, reviews: mappedReviews });
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

export const updateController = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string | undefined;
    const user = (req as any).user;
    if (!id) {
        res.status(400).json({ error: 'Missing id parameter' });
        return;
    }
    if (!user || !user.user_id) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    try {
        const fanfic = await getById(id);
        if (!fanfic) {
            res.status(404).json({ error: 'Fanfic not found' });
            return;
        }
        if (fanfic.user_id !== user.user_id) {
            res.status(403).json({ error: 'Only author can edit this fanfic' });
            return;
        }
        await updateAsync(id, req.body);
        res.status(200).json({ message: 'Fanfic updated' });
    } catch (error) {
        console.error('Update failed', error);
        res.status(500).json({ error: 'Update failed' });
    }
};
