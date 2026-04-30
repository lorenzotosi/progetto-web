// server/src/controllers/admin.controller.ts
import type { Request, Response } from 'express';
import { AdminService } from '../services/admin.service.js';
import { PresenceManager } from '../sockets/presenceManager.js';

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await AdminService.getAllUsersBasicInfo();

        const usersWithPresence = users.map(user => ({
            id: user._id.toString(),
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            lastSeen: user.lastSeen,
            isOnline: PresenceManager.isUserOnline(user._id.toString())
        }));

        res.status(200).json(usersWithPresence);
    } catch (error) {
        console.error('[AdminController] Errore nel recupero utenti:', error);
        res.status(500).json({ error: 'Errore interno del server durante il recupero utenti.' });
    }
};