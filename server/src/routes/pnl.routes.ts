import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import { authorize } from '../middleware/rbac.middleware';
import { profitPerOrder, profitPerBlock, monthlyProfit } from '../controllers/pnl.controller';

const router = express.Router();

router.get('/order/:orderId', authenticateToken, authorize(['ADMIN','MANAGER','ACCOUNTANT']), profitPerOrder);
router.get('/block/:blockId', authenticateToken, authorize(['ADMIN','MANAGER','ACCOUNTANT']), profitPerBlock);
router.get('/monthly', authenticateToken, authorize(['ADMIN','MANAGER','ACCOUNTANT']), monthlyProfit);

export default router;

