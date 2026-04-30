import {UserModel} from '../models/User.js';

const connectedUsers = new Map<string, Set<string>>(); // <userId, Set<socketId>>

export const PresenceManager = {
    addConnection(userId: string, socketId: string): void {
        if (!connectedUsers.has(userId)) {
            connectedUsers.set(userId, new Set());
        }
        connectedUsers.get(userId)!.add(socketId);
    },

    async removeConnection(userId: string, socketId: string): Promise<void> {
        const userSockets = connectedUsers.get(userId);
        if (userSockets) {
            userSockets.delete(socketId);
            if (userSockets.size === 0) {
                connectedUsers.delete(userId);
                try {
                    await UserModel.findByIdAndUpdate(userId, { lastSeen: new Date() });
                    console.log(`[Presence] User ${userId} is now offline. DB updated.`);
                } catch (err) {
                    console.error(`[Presence Error] Failed to update lastSeen for ${userId}:`, err);
                }
            }
        }
    },

    isUserOnline(userId: string): boolean {
        const userSockets = connectedUsers.get(userId);
        return userSockets !== undefined && userSockets.size > 0;
    }
};