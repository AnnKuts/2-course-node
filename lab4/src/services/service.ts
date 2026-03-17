import { Fanfic } from "../models/fanfic.ts";
import { getAll } from "../repository/repo.ts";

export const getAllFanfics = async (): Promise<Fanfic[]> => {
    return await getAll();
};
