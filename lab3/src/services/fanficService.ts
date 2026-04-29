import { Fanfic } from "../models/fanfic.ts";
import { getAllSync, getFanficByIdAsync, saveFanficAsync as repoSave, deleteFanficAsync } from '../repository/fanficRepo.ts';
import { getReviewsByPubIdAsync } from '../repository/reviewRepo.ts';
import { UUID } from 'node:crypto';

export const getAllFanfics = (): (Fanfic[] | []) => {
    console.log('Service: getAllFanfics called');
    return getAllSync().filter(fanfic => fanfic.reports < 5);
}

export const getByIdAsync = async (id: string): Promise<Fanfic | null> => {
    return await getFanficByIdAsync(id);
};

export const createAsync = async (fanfic: Omit<Fanfic, 'fanfic_id'>): Promise<Fanfic> => {
    const newFanfic: Fanfic = {
        fanfic_id: Date.now().toString(),
        ...fanfic
    };
    await repoSave(newFanfic);
    return newFanfic;
};

export const updateAsync = async (fanfic: Fanfic): Promise<void> => {
    await repoSave(fanfic);
};

export const deleteAsync = async (id: string): Promise<boolean> => {
    return await deleteFanficAsync(id);
};

export const updateFanficRatingAsync = async (fanfic_id: UUID): Promise<void> => {
    const fanfic = await getFanficByIdAsync(fanfic_id as string);
    if (!fanfic) return;

    const reviews = await getReviewsByPubIdAsync(fanfic_id);
    let averageRating = 0;
    if (reviews.length > 0) {
        averageRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
    }

    fanfic.rating = averageRating;
    await repoSave(fanfic);
};
