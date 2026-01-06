import express from 'express';
import { clearDomainData } from '../controllers/admin.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { authorize } from '../middleware/rbac.middleware';

const router = express.Router();

router.delete('/clear-all', authenticateToken, authorize(['ADMIN']), clearDomainData);

export default router;
