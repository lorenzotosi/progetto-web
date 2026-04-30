import { Router } from 'express';
import { getAllUsers } from '../controllers/admin.controller.js';
import { requireAuth, requireAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/users', requireAuth, requireAdmin, getAllUsers);

export default router;