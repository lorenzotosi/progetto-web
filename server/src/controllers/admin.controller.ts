// server/src/controllers/admin.controller.ts
import type { Request, Response } from 'express';
import { AdminService } from '../services/admin.service.js';
import { PresenceManager } from '../sockets/presenceManager.js';

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await AdminService.getAllUsersBasicInfo();

        const userIds = users.map(user => user._id.toString());
        const onlineUsersSet = await PresenceManager.getOnlineUsers(userIds);

        const usersWithPresence = users.map((user) => {
            const userIdStr = user._id.toString();
            return {
                id: userIdStr,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                lastSeen: user.lastSeen,
                isOnline: onlineUsersSet.has(userIdStr)
            };
        });

        res.status(200).json(usersWithPresence);
    } catch (error) {
        console.error('[AdminController] Errore nel recupero utenti:', error);
        res.status(500).json({ error: 'Errore interno del server durante il recupero utenti.' });
    }
};