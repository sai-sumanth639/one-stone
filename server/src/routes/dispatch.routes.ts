import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import { authorize } from '../middleware/rbac.middleware';
import { createDispatch, updateDispatchStatus, getDispatches } from '../controllers/dispatch.controller';

const router = express.Router();

router.post('/', authenticateToken, authorize(['ADMIN','MANAGER','SALES','PRODUCTION']), createDispatch);
router.patch('/:id/status', authenticateToken, authorize(['ADMIN','MANAGER','SALES','PRODUCTION']), updateDispatchStatus);
router.get('/', authenticateToken, authorize(['ADMIN','MANAGER','SALES','PRODUCTION','ACCOUNTANT']), getDispatches);

export default router;

