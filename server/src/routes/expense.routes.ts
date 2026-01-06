import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import { authorize } from '../middleware/rbac.middleware';
import { createExpense, getExpenses } from '../controllers/expense.controller';

const router = express.Router();

router.post('/', authenticateToken, authorize(['ADMIN','ACCOUNTANT','MANAGER']), createExpense);
router.get('/', authenticateToken, authorize(['ADMIN','ACCOUNTANT','MANAGER']), getExpenses);

export default router;

