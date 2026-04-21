import { getAllFanfics, getByIdAsync, createAsync, updateAsync } from '../services/fanficService.ts';
import { Request, Response } from 'express';

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
            genre: [],
            restriction: '0+',
            rating: 0,
            reports: 0
        } 
    });
};

export const createController = async (req: Request, res: Response): Promise<void> => {
    const { title, genres } = req.body;
    if (!title || !genres) {
        res.status(400).json({ error: 'Missing fields' });
        return;
    }
    const newId = await createAsync(req.body);
    res.status(201).json({ fanfic_id: newId, message: 'Fanfic created' });
};

export const updateController = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string | undefined;
    if (!id) {
        res.status(400).json({ error: 'Missing id parameter' });
        return;
    }
    try {
        await updateAsync(id, req.body);
        res.status(200).json({ message: 'Fanfic updated' });
    } catch (error) {
        console.error('Update failed', error);
        res.status(500).json({ error: 'Update failed' });
    }
};
