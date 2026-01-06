import express from 'express';
import { createSupplier, getSuppliers, addBlock, getBlocks } from '../controllers/purchase.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/suppliers', authenticateToken, createSupplier);
router.get('/suppliers', authenticateToken, getSuppliers);
router.post('/blocks', authenticateToken, addBlock);
router.get('/blocks', authenticateToken, getBlocks);

export default router;
