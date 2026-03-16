import { Fanfic } from "../models/fanfic.ts";
import { getAllSync } from "../repository/repo.ts";

export const getAllFanfics = (): (Fanfic[] | []) => {
    console.log('Service: getAllFanfics called');
    return getAllSync().filter(fanfic => fanfic.reports < 5);
}