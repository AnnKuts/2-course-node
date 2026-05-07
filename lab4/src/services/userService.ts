import { getAllUsers } from '../repository/userRepo.ts';
import { User } from '../models/user.ts';

export const getAllUsersServiceAsync = async (): Promise<User[]> => {
    return await getAllUsers();
};
