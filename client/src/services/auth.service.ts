import { api } from './api';

export interface AuthResponse {
    token: string;
    user: {
        id: string;
        email: string;
        role?: string;
    };
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
    }
};