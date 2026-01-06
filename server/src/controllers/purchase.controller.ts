import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const createSupplier = async (req: Request, res: Response) => {
  try {
    const supplier = await prisma.supplier.create({
      data: req.body,
    });
    res.status(201).json(supplier);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create supplier' });
  }
};

export const getSuppliers = async (req: Request, res: Response) => {
  try {
    const suppliers = await prisma.supplier.findMany();
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch suppliers' });
  }
};

export const addBlock = async (req: Request, res: Response) => {
  try {
    const { supplierId, blockNumber, purchaseDate, length, height, width, purchasePrice, transportCost } = req.body;
    
    // Calculate total cost or other derived fields if necessary, but DB stores raw data mostly.
    // Total Cost is stored in schema as calculated field?
    // Schema: totalCost Float // Calculated.
    // We should calculate it here or let frontend send it. Best to calculate here to ensure consistency.
    const totalCost = Number(purchasePrice) + Number(transportCost);

    const block = await prisma.block.create({
      data: {
        supplierId,
        blockNumber,
        purchaseDate: new Date(purchaseDate),
        length: Number(length),
        height: Number(height),
        width: Number(width),
        purchasePrice: Number(purchasePrice),
        transportCost: Number(transportCost),
        totalCost,
        status: 'IN_STOCK'
      }
    });

    res.status(201).json(block);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add block' });
  }
};

export const getBlocks = async (req: Request, res: Response) => {
  try {
    const blocks = await prisma.block.findMany({
      include: { supplier: true }
    });
    res.json(blocks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch blocks' });
  }
};
