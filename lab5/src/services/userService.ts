import { getAllUsers } from '../repository/userRepo.ts';
import type { User } from '../models/user.ts';

export type PublicUser = Pick<User, 'id' | 'username'>;

export const getAllUsersServiceAsync = async (): Promise<PublicUser[]> => {
    const users = await getAllUsers();

    return users.map(({ id, username }) => ({
        id,
        username,
    }));
};
