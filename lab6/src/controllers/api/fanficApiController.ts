import { Request, Response } from 'express';
import {
    getAllFanfics,
    getFanficsFilteredAsync,
    getByIdAsync,
    createAsync,
    updateAsync,
    deleteAsync,
    checkTitleUnique,
} from '../../services/fanficService.ts';
import { AuthenticatedRequest } from '../../middleware/authMiddleware.ts';

export const renderHomeController = async (_req: Request, res: Response): Promise<void> => {
    try {
        const fanfics = await getAllFanfics();
        res.render('index', {
            title: 'Fanfics',
            fanfics,
        });
    } catch {
        res.status(500).send('Failed to retrieve fanfics');
    }
};

/**
 * GET /api/v1/fanfics
 * Фільтрація + пагінація.
 *
 * Query params:
 *   page        (default 1)
 *   limit       (default 10, max 100)
 *   genre       — точна назва жанру
 *   restriction — рівень обмежень (0+, 12+, 16+, 18+)
 *   minRating   — мінімальний рейтинг
 *   search      — пошук у назві (ILIKE)
 */
export const listFanficsController = async (req: Request, res: Response): Promise<void> => {
    const page  = Math.max(1, parseInt(req.query.page  as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 10));
    const genre       = (req.query.genre       as string) || undefined;
    const restriction = (req.query.restriction as string) || undefined;
    const minRating   = req.query.minRating !== undefined ? Number(req.query.minRating) : undefined;
    const search      = (req.query.search      as string) || undefined;

    if (minRating !== undefined && (isNaN(minRating) || minRating < 0 || minRating > 5)) {
        res.status(400).json({ error: 'minRating must be a number between 0 and 5' });
        return;
    }

    try {
        const { rows, count } = await getFanficsFilteredAsync({ page, limit, genre, restriction, minRating, search });
        res.status(200).json({
            data: rows,
            pagination: {
                total: count,
                page,
                limit,
                totalPages: Math.ceil(count / limit),
            },
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve fanfics' });
    }
};

/** GET /api/v1/fanfics/:id */
export const getFanficController = async (req: Request, res: Response): Promise<void> => {
    try {
        const fanfic = await getByIdAsync(String(req.params.id));
        if (!fanfic) {
            res.status(404).json({ error: 'Fanfic not found' });
            return;
        }
        res.status(200).json({ data: fanfic });
    } catch {
        res.status(500).json({ error: 'Failed to retrieve fanfic' });
    }
};

/** POST /api/v1/fanfics */
export const createFanficController = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { title, genre } = req.body;
    const user_id = req.user?.user_id;

    if (!user_id) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    if (!title || typeof title !== 'string' || title.trim().length < 3) {
        res.status(400).json({ error: 'title must be at least 3 characters' });
        return;
    }
    if (!genre) {
        res.status(400).json({ error: 'genre is required' });
        return;
    }

    try {
        const isUnique = await checkTitleUnique(title);
        if (!isUnique) {
            res.status(409).json({ error: 'Fanfic with this title already exists' });
            return;
        }
        const id = await createAsync({ ...req.body, user_id });
        res.status(201).json({ fanfic_id: id, message: 'Fanfic created' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create fanfic' });
    }
};

/** PUT /api/v1/fanfics/:id */
export const updateFanficController = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const id = String(req.params.id);
    const user_id = req.user?.user_id;

    try {
        const existing = await getByIdAsync(id);
        if (!existing) {
            res.status(404).json({ error: 'Fanfic not found' });
            return;
        }
        if (existing.user_id !== user_id) {
            res.status(403).json({ error: 'Only the author can edit this fanfic' });
            return;
        }
        await updateAsync(id, req.body);
        res.status(200).json({ message: 'Fanfic updated' });
    } catch (err) {
        const msg = err instanceof Error ? err.message : 'Update failed';
        res.status(500).json({ error: msg });
    }
};

/** DELETE /api/v1/fanfics/:id */
export const deleteFanficController = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const id = String(req.params.id);
    const user_id = req.user?.user_id;

    try {
        const existing = await getByIdAsync(id);
        if (!existing) {
            res.status(404).json({ error: 'Fanfic not found' });
            return;
        }
        if (existing.user_id !== user_id) {
            res.status(403).json({ error: 'Only the author can delete this fanfic' });
            return;
        }
        await deleteAsync(id);
        res.status(200).json({ message: 'Fanfic deleted' });
    } catch {
        res.status(500).json({ error: 'Failed to delete fanfic' });
    }
};
