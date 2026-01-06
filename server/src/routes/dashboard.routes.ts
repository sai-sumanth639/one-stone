import express from 'express';
import { getDashboardStats, getDashboardTrends } from '../controllers/dashboard.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/stats', authenticateToken, getDashboardStats);
router.get('/trends', authenticateToken, getDashboardTrends);

export default router;
