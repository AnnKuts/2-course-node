export interface User {
    user_id: string;
    username: string;
    email: string;
    password: string;
    is_admin: boolean;
    is_active: boolean;
}

export type PublicUser = Omit<User, 'password'>;
