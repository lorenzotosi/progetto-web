import { UserModel } from '../models/User.js';

export class AdminService {
    /**
     * Recupera gli utenti dal database applicando la proiezione
     * per escludere dati sensibili come la password.
     */
    static async getAllUsersBasicInfo() {
        return UserModel.find({}, {
            firstName: 1,
            lastName: 1,
            email: 1,
            role: 1,
            lastSeen: 1,
            createdAt: 1
        }).lean();
    }
}