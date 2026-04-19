import { Request, Response } from 'express';
import { getAllFanfics, getByIdAsync, createAsync, updateAsync } from '../services/fanficService.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.ts';

export const getAllFanficsController = (req: Request, res: Response) => {
    try {
        console.log('Controller: getAllFanficsController called');
        const fanfics = getAllFanfics();
        res.render('index', {
            title: 'Fanfics',
            fanfics
        })
    } catch (error) {
        res.status(500).send('Failed to retrieve fanfics');
    }
}

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
            genre: []
        } 
    });
};

export const saveController = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const idFromParams = req.params.id as string | undefined;
    const { title, description, content, genre, id: idFromBody } = req.body;
    const id = idFromParams || idFromBody;
    const user_id = req.user?.user_id;

    if (!title || !description || !content || !user_id || !genre) {
        res.status(400).json({ error: 'Missing fields' });
        return;
    }

    try {
        if (id) {
            const existing = await getByIdAsync(id);
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
            fanfic_id: id || Date.now().toString(),
            user_id,
            title,
            description,
            content,
            genre: Array.isArray(genre) ? genre : [genre],
            restriction: '18+',
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