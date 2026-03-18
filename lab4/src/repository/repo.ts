import { pool } from '../db.ts';
import { Fanfic } from '../models/fanfic.ts';

export const getAll = async (): Promise<Fanfic[]> => {
    const result = await pool.query<Fanfic>('SELECT * FROM fanfics');
    return result.rows;
};
