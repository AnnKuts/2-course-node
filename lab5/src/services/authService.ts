import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createUser, findUserByEmail } from '../repository/userRepo.ts';
import { PublicUser, User } from '../models/user.ts';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined. Add it to your .env file.');
}

export interface AuthPayload {
    user_id: string;
    username: string;
    email: string;
    is_admin: boolean;
    is_active: boolean;
}

interface AuthResult {
    token: string;
    user: PublicUser;
}

const toPublicUser = (user: User): PublicUser => {
    const { password: _password, ...publicUser } = user;
    return publicUser;
};

const signToken = (payload: AuthPayload): string => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
};

export const registerUser = async (
    username: string,
    email: string,
    password: string
): Promise<AuthResult> => {
    const existingUser = await findUserByEmail(email);

    if (existingUser) {
        throw new Error('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await createUser(username, email, hashedPassword);

    const payload: AuthPayload = {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        is_admin: user.is_admin,
        is_active: user.is_active
    };

    return {
        token: signToken(payload),
        user: toPublicUser(user)
    };
};

export const loginUser = async (email: string, password: string): Promise<AuthResult> => {
    const user = await findUserByEmail(email);

    if (!user) {
        throw new Error('Invalid credentials');
    }

    if (!user.is_active) {
        throw new Error('User is inactive');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw new Error('Invalid credentials');
    }

    const payload: AuthPayload = {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        is_admin: user.is_admin,
        is_active: user.is_active
    };

    return {
        token: signToken(payload),
        user: toPublicUser(user)
    };
};

export const verifyToken = (token: string): AuthPayload => {
    return jwt.verify(token, JWT_SECRET) as AuthPayload;
};
