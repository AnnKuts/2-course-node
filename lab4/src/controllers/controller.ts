import { getAllFanfics } from '../services/service.ts';
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
