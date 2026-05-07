import { getAllUsersSync } from '../repository/userRepo.ts';
import { User } from '../models/user.ts';

type PublicUser = Pick<User, 'user_id' | 'username'>;

export const getAllUsersServiceSync = (): PublicUser[] => {
    return getAllUsersSync().map(({ user_id, username }) => ({
        user_id,
        username,
    }));
};
