import { getAllUsersSync } from '../repository/userRepo.ts';
import { User } from '../models/user.ts';

export const getAllUsersServiceSync = (): User[] => {
    return getAllUsersSync();
};
