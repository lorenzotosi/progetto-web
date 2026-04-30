import { api } from './api';
import type { User } from '../types/user.types';

export interface AdminDashboardUser extends User {
    isOnline: boolean;
    lastSeen?: string;
    createdAt: string;
}

export const AdminService = {
    async getAllUsers(): Promise<AdminDashboardUser[]> {
        const response = await api.get<AdminDashboardUser[]>('/admin/users');
        return response.data;
    }
};