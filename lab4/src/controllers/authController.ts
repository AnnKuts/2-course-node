import { Request, Response } from 'express';
import { registerUser, loginUser } from '../services/authService.ts';
import { AuthenticatedRequest } from '../middleware/authMiddleware.ts';

export const registerController = async (req: Request, res: Response): Promise<void> => {
    const { username, email, password } = req.body as {
        username?: string;
        email?: string;
        password?: string;
    };

    if (!username || !email || !password) {
        res.status(400).json({ message: 'username, email, and password are required' });
        return;
    }

    try {
        const result = await registerUser(username, email, password);
        res.status(201).json(result);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Registration failed';
        const statusCode = message === 'Email already exists' ? 409 : 500;
        res.status(statusCode).json({ message });
    }
};

export const loginController = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body as {
        email?: string;
        password?: string;
    };

    if (!email || !password) {
        res.status(400).json({ message: 'email and password are required' });
        return;
    }

    try {
        const result = await loginUser(email, password);
        res.status(200).json(result);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Login failed';
        const statusCode = message === 'Invalid credentials' || message === 'User is inactive' ? 401 : 500;
        res.status(statusCode).json({ message });
    }
};

export const meController = (req: AuthenticatedRequest, res: Response): void => {
    if (!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }

    res.status(200).json({ user: req.user });
};
