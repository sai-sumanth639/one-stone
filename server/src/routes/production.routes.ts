import express from 'express';
import { processBlockToSlabs, getInventory } from '../controllers/production.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/process', authenticateToken, processBlockToSlabs);
router.get('/inventory', authenticateToken, getInventory);

export default router;
