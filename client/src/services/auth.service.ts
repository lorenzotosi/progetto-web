import { api } from './api';
import type {User} from "../types/user.types.ts";

export interface AuthResponse {
    token: string;
    user: User
}

export const AuthClientService = {
    async login(email: string, password: string): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>('/auth/login', { email, password });
        return response.data;
    },

    async register(email: string, password: string, firstName: string, lastName: string): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>('/auth/register', {
            email,
            password,
            firstName,
            lastName
        });
        return response.data;
    },

    async logout(): Promise<void> {
        await api.post('/auth/logout');
    }
};