import {UserModel} from '../models/User.js';
import type {Server} from "socket.io";

let ioInstance: Server;

export const PresenceManager = {

    init(io: Server) {
        ioInstance = io;
    },

    async addConnection(userId: string, socketId: string): Promise<void> {
        try {
            if (!ioInstance) return;
            const sockets = await ioInstance.in(`user:${userId}`).fetchSockets();
            
            if (sockets.length === 1) {
                ioInstance.to('admin:dashboard').emit('presence_update', {
                    userId,
                    isOnline: true
                });
            }

            console.log(`[Presence] (Adapter) Aggiunto Socket ${socketId} per User ${userId}, Sockets attivi: ${sockets.length}`);
        } catch (error) {
            console.error(`[Presence Error] (Adapter) Fallita addConnection:`, error);
        }
    },

    async removeConnection(userId: string, socketId: string): Promise<void> {
        try {
            setTimeout(async () => {
                try {
                    if (!ioInstance) return;
                    const sockets = await ioInstance.in(`user:${userId}`).fetchSockets();

                    if (sockets.length === 0) {
                        const now = new Date();
                        await UserModel.findByIdAndUpdate(userId, { lastSeen: now });

                        ioInstance.to('admin:dashboard').emit('presence_update', {
                            userId,
                            isOnline: false,
                            lastSeen: now.toISOString()
                        });
                        console.log(`[Presence] Utente ${userId} è definitivamente offline.`);
                    } else {
                        console.log(`[Presence] Disconnessione annullata per ${userId} (Network Flap gestito o multi-device). Sockets rimasti: ${sockets.length}`);
                    }
                } catch (err) {
                    console.error(`[Presence] Errore nel Grace Period per ${userId}:`, err);
                }
            }, 3000);

        } catch (error) {
            console.error(`[Presence] Adapter Error:`, error);
        }
    },

    async isUserOnline(userId: string): Promise<boolean> {
        try {
            if (!ioInstance) return false;
            const sockets = await ioInstance.in(`user:${userId}`).fetchSockets();
            return sockets.length > 0;
        } catch (error) {
            console.error(`[Presence Error] (Adapter) Fallita isUserOnline:`, error);
            return false;
        }
    },

    async getOnlineUsers(userIds: string[]): Promise<Set<string>> {
        try {
            if (!ioInstance || userIds.length === 0) return new Set();
            const rooms = userIds.map(id => `user:${id}`);
            const sockets = await ioInstance.in(rooms).fetchSockets();
            
            const onlineUsers = new Set<string>();
            for (const socket of sockets) {
                for (const room of socket.rooms) {
                    if (room.startsWith('user:')) {
                        onlineUsers.add(room.substring(5));
                    }
                }
            }
            return onlineUsers;
        } catch (error) {
            console.error(`[Presence Error] (Adapter) Fallita getOnlineUsers:`, error);
            return new Set();
        }
    }
};