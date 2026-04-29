import { Fanfic } from '../models/fanfic.ts';
import { getAll, getById, create, update } from '../repository/fanficRepository.ts';

export const getAllFanfics = async (): Promise<Fanfic[]> => {
    return await getAll();
};

export const getByIdAsync = async (id: string): Promise<Fanfic | null> => {
    return await getById(id);
};

export const createAsync = async (data: Partial<Fanfic>): Promise<string> => {
    if (!data.user_id) {
        throw new Error('user_id is required');
    }
    const fanfic: Partial<Fanfic> = {
        fanfic_id: undefined,
        user_id: data.user_id,
        title: data.title ?? '',
        description: data.description ?? '',
        content: data.content ?? '',
        genre: data.genre ?? '',
        restriction: data.restriction ?? '0+',
        rating: data.rating !== undefined ? Number(data.rating) : 0,
        reports: data.reports !== undefined ? Number(data.reports) : 0
    };
    return await create(fanfic);
};

export const updateAsync = async (id: string, patch: Partial<Fanfic>) => {
    await update(id, patch);
};

export const checkTitleUnique = async (title: string): Promise<boolean> => {
    const allFanfics = await getAll();
    return !allFanfics.some(f => f.title.trim().toLowerCase() === title.trim().toLowerCase());
};
