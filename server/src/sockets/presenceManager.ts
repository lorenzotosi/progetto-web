import {UserModel} from '../models/User.js';
import {redisClient} from "../config/redis.js";
import type {Server} from "socket.io";

let ioInstance: Server;

export const PresenceManager = {

    init(io: Server) {
        ioInstance = io;
    },

    async addConnection(userId: string, socketId: string): Promise<void> {
        try {
            const key = `user_sockets:${userId}`;
            await redisClient.sAdd(key, socketId);

            const activeSockets = await redisClient.sCard(key);
            if (activeSockets === 1 && ioInstance) {
                ioInstance.to('admin:dashboard').emit('presence_update', {
                    userId,
                    isOnline: true
                });
            }

            console.log(`[Presence] (Redis) Aggiunto Socket ${socketId} per User ${userId}`);
        } catch (error) {
            console.error(`[Presence Error] (Redis) Fallita addConnection:`, error);
        }
    },

    async removeConnection(userId: string, socketId: string): Promise<void> {
        try {
            const key = `user_sockets:${userId}`;
            await redisClient.sRem(key, socketId);

            setTimeout(async () => {
                try {
                    const remainingSockets = await redisClient.sCard(key);

                    if (remainingSockets === 0) {
                        const now = new Date();
                        await UserModel.findByIdAndUpdate(userId, { lastSeen: now });

                        if (ioInstance) {
                            ioInstance.to('admin:dashboard').emit('presence_update', {
                                userId,
                                isOnline: false,
                                lastSeen: now.toISOString()
                            });
                        }
                        console.log(`[Presence] Utente ${userId} è definitivamente offline.`);
                    } else {
                        console.log(`[Presence] Disconnessione annullata per ${userId} (Network Flap gestito).`);
                    }
                } catch (err) {
                    console.error(`[Presence] Errore nel Grace Period per ${userId}:`, err);
                }
            }, 3000);

        } catch (error) {
            console.error(`[Presence] Redis Error:`, error);
        }
    },

    async isUserOnline(userId: string): Promise<boolean> {
        try {
            const key = `user_sockets:${userId}`;
            const activeSockets = await redisClient.sCard(key);
            return activeSockets > 0;
        } catch (error) {
            console.error(`[Presence Error] (Redis) Fallita isUserOnline:`, error);
            return false;
        }
    }
};