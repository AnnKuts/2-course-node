import { UserModel } from '../models/associations.ts';
import { User } from '../models/user.ts';
import sequelize from '../sequelize.ts';

const toUser = (m: UserModel): User => ({
    user_id: m.user_id,
    username: m.username,
    email: m.email,
    password: m.password,
    is_admin: m.is_admin ?? false,
    is_active: m.is_active ?? true,
});

export const findUserByEmail = async (email: string): Promise<User | null> => {
    const user = await UserModel.findOne({ where: { email } });
    return user ? toUser(user) : null;
};

export const findUserById = async (user_id: string): Promise<User | null> => {
    const user = await UserModel.findByPk(user_id);
    return user ? toUser(user) : null;
};

export const createUser = async (
    username: string,
    email: string,
    hashedPassword: string
): Promise<User> => {
    return await sequelize.transaction(async (t) => {
        const user = await UserModel.create(
            { username, email, password: hashedPassword },
            { transaction: t }
        );
        return toUser(user);
    });
};

export const getAllUsers = async (): Promise<User[]> => {
    const users = await UserModel.findAll();
    return users.map(toUser);
};
