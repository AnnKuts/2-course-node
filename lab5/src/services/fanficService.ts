import { Fanfic } from '../models/fanfic.ts';
import { getAll, getById, create, update, deleteById } from '../repository/fanficRepository.ts';
import { getReviewsByPubIdAsync } from '../repository/reviewRepo.ts';
import { UUID } from 'node:crypto';

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
        genre: Array.isArray(data.genre) ? data.genre : (data.genre ? [data.genre] : []),
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

export const deleteAsync = async (id: string): Promise<boolean> => {
    return await deleteById(id);
};

export const updateFanficRatingAsync = async (fanfic_id: UUID): Promise<void> => {
    const reviews = await getReviewsByPubIdAsync(fanfic_id);
    const averageRating = reviews.length > 0
    ? reviews.reduce((acc, r) => acc + Number(r.rating), 0) / reviews.length
        : 0;
    await update(fanfic_id as string, { rating: averageRating });
};
