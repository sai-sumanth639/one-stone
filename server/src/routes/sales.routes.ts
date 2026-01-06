import express from 'express';
import { createCustomer, createOrder, getOrders, getCustomers, deleteAllCustomers } from '../controllers/sales.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { authorize } from '../middleware/rbac.middleware';

const router = express.Router();

router.post('/customers', authenticateToken, createCustomer);
router.get('/customers', authenticateToken, getCustomers);
router.delete('/customers', authenticateToken, authorize(['ADMIN']), deleteAllCustomers);
router.post('/orders', authenticateToken, createOrder);
router.get('/orders', authenticateToken, getOrders);

export default router;
