import { Fanfic } from '../models/fanfic.ts';
import { getAll, getById, create, update } from '../repository/fanficRepository.ts';

export const getAllFanfics = async (): Promise<Fanfic[]> => {
    return await getAll();
};

export const getByIdAsync = async (id: string): Promise<Fanfic | null> => {
    return await getById(id);
};

export const createAsync = async (data: Partial<Fanfic>): Promise<string> => {
    const fanfic: Partial<Fanfic> = {
        fanfic_id: undefined,
        user_id: '',
        title: data.title ?? '',
        description: data.description ?? '',
        content: data.content ?? '',
        genres: Array.isArray(data.genres) ? data.genres : (data.genres ? [data.genres] : []),
        restriction: data.restriction ?? '0+',
        rating: data.rating !== undefined ? Number(data.rating) : 0,
        reports: data.reports !== undefined ? Number(data.reports) : 0
    };
    return await create(fanfic);
};

export const updateAsync = async (id: string, patch: Partial<Fanfic>) => {
    await update(id, patch);
};
