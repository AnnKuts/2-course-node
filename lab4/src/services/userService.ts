import { getAllUsers } from '../repository/userRepo.ts';
import { User } from '../models/user.ts';

type PublicUser = Pick<User, 'id' | 'username'>;

export const getAllUsersServiceAsync = async (): Promise<PublicUser[]> => {
    const users = await getAllUsers();
    return users.map(({ id, username }) => ({ id, username }));
};
