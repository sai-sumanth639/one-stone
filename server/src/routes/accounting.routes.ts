import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import { authorize } from '../middleware/rbac.middleware';
import { recordPayment, getOutstanding } from '../controllers/accounting.controller';

const router = express.Router();

router.post('/payments', authenticateToken, authorize(['ADMIN','ACCOUNTANT','MANAGER']), recordPayment);
router.get('/outstanding', authenticateToken, authorize(['ADMIN','ACCOUNTANT','MANAGER','SALES']), getOutstanding);

export default router;

