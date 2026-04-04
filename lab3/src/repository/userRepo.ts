import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { User } from '../models/user.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const usersPath = path.join(__dirname, '../../data/users.json');

export const getAllUsersSync = (): User[] => {
    try {
        const data = fs.readFileSync(usersPath, 'utf-8');
        return JSON.parse(data) as User[];
    } catch (error) {
        console.error('Error reading users data:', error);
        return [];
    }
};

export const saveAllUsersSync = (users: User[]): void => {
    fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
};

export const findUserByEmail = (email: string): User | undefined => {
    const users = getAllUsersSync();
    return users.find((user) => user.email.toLowerCase() === email.toLowerCase());
};

export const createUserSync = (user: User): User => {
    const users = getAllUsersSync();
    users.push(user);
    saveAllUsersSync(users);
    return user;
};
