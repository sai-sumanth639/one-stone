import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const createDispatch = async (req: Request, res: Response) => {
  const { orderId, driverName, vehicleNumber, status } = req.body;
  try {
    const result = await prisma.$transaction(async (tx) => {
      const order = await tx.salesOrder.update({
        where: { id: orderId },
        data: { status: 'DISPATCHED' },
      });

      const dispatch = await tx.dispatch.create({
        data: {
          orderId,
          driverName,
          vehicleNumber,
          status: status || 'In Transit',
        },
      });
      return { order, dispatch };
    });
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create dispatch' });
  }
};

export const updateDispatchStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const dispatch = await prisma.dispatch.update({
      where: { id },
      data: { status },
    });
    if (status === 'Delivered') {
      await prisma.salesOrder.update({
        where: { id: dispatch.orderId },
        data: { status: 'COMPLETED' },
      });
    }
    res.json(dispatch);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update dispatch status' });
  }
};

export const getDispatches = async (req: Request, res: Response) => {
  try {
    const list = await prisma.dispatch.findMany({ include: { order: true } });
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dispatches' });
  }
};

