import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const clearDomainData = async (_req: Request, res: Response) => {
  try {
    await prisma.$transaction(async (tx) => {
      await tx.salesOrderItem.deleteMany({});
      await tx.dispatch.deleteMany({});
      await tx.invoice.deleteMany({});
      await tx.salesOrder.deleteMany({});
      await tx.expense.deleteMany({});
      await tx.transaction.deleteMany({});
      await tx.slab.deleteMany({});
      await tx.block.deleteMany({});
      await tx.supplier.deleteMany({});
      await tx.customer.deleteMany({});
    });
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to clear data' });
  }
};
