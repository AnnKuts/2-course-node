import { getAllFanfics } from '../services/service.ts'
import { Request, Response } from 'express';

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