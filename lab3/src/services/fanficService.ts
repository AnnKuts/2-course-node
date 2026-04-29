import { Fanfic } from "../models/fanfic.ts";
import { getAllSync, getAllFanficsAsync, getFanficByIdAsync, saveFanficAsync as repoSave, deleteFanficAsync } from '../repository/fanficRepo.ts';

export const getAllFanfics = (): (Fanfic[] | []) => {
    console.log('Service: getAllFanfics called');
    return getAllSync().filter(fanfic => fanfic.reports < 5);
}

// export const getAllAsync = async (): Promise<Fanfic[]> => {
//     return await getAllFanficsAsync();
// };

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
