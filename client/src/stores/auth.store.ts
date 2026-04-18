import { defineStore } from 'pinia';
import { ref } from 'vue';
import type {User} from "../types/user.types.ts";

export const useAuthStore = defineStore('auth', () => {
    const token = ref<string | null>(localStorage.getItem('token'));

    const getInitialUser = (): User | null => {
        try {
            const storedUser = localStorage.getItem('user');
            return storedUser ? JSON.parse(storedUser) : null;
        } catch {
            return null;
        }
    };
    const user = ref<User | null>(getInitialUser());

    const setAuthData = (newToken: string, userData: User) => {
        token.value = newToken;
        user.value = userData;

        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        token.value = null;
        user.value = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    const isAuthenticated = () => !!token.value;
    const isAdmin = () => user.value?.role === 'ADMIN';

    return { token, user, setAuthData, logout, isAuthenticated, isAdmin };
});