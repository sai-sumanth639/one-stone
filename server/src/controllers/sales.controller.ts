import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const createCustomer = async (req: Request, res: Response) => {
    try {
        const name = (req.body?.name || '').trim();
        if (!name) {
            return res.status(400).json({ error: 'Customer name is required' });
        }
        const customer = await prisma.customer.create({ data: { name } });
        res.status(201).json(customer);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create customer' });
    }
};

export const getCustomers = async (req: Request, res: Response) => {
    try {
        const q = (req.query.q as string) || '';
        const customers = await prisma.customer.findMany({
            where: q ? { name: { contains: q, mode: 'insensitive' } } : undefined,
            orderBy: { createdAt: 'desc' }
        });
        res.json(customers);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch customers' });
    }
};

export const createOrder = async (req: Request, res: Response) => {
    const { customerId, items, discount, taxAmount } = req.body; 
    // items: [{ slabId, pricePerSqFt }]

    try {
        const result = await prisma.$transaction(async (tx) => {
            // Calculate totals
            let totalAmount = 0;
            const orderItemsData = [];

            for (const item of items) {
                const slab = await tx.slab.findUnique({ where: { id: item.slabId } });
                if (!slab || slab.status !== 'AVAILABLE') {
                    throw new Error(`Slab ${item.slabId} is not available`);
                }

                const itemTotal = slab.sqFt * item.pricePerSqFt;
                totalAmount += itemTotal;

                orderItemsData.push({
                    slabId: item.slabId,
                    pricePerSqFt: item.pricePerSqFt,
                    totalPrice: parseFloat(itemTotal.toFixed(2))
                });

                // Update Slab Status
                await tx.slab.update({
                    where: { id: item.slabId },
                    data: { status: 'SOLD' }
                });
            }

            const finalAmount = totalAmount - (discount || 0) + (taxAmount || 0);

            // Create Order
            const order = await tx.salesOrder.create({
                data: {
                    customerId,
                    totalAmount: parseFloat(totalAmount.toFixed(2)),
                    discount: discount || 0,
                    taxAmount: taxAmount || 0,
                    finalAmount: parseFloat(finalAmount.toFixed(2)),
                    status: 'CONFIRMED',
                    items: {
                        create: orderItemsData
                    }
                }
            });

            // Create Invoice automatically
            const invoice = await tx.invoice.create({
                data: {
                    orderId: order.id,
                    invoiceNumber: `INV-${Date.now()}`,
                    amount: order.finalAmount,
                    status: 'UNPAID'
                }
            });

            // Update Customer Outstanding Balance?
            // Usually managed by sum of unpaid invoices, but if we have a field:
            // await tx.customer.update({ where: { id: customerId }, data: { outstandingBalance: { increment: finalAmount } } });

            return { order, invoice };
        });

        res.status(201).json(result);
    } catch (error: any) {
        console.error(error);
        res.status(400).json({ error: error.message || 'Failed to create order' });
    }
};

export const getOrders = async (req: Request, res: Response) => {
    try {
        const orders = await prisma.salesOrder.findMany({
            include: { customer: true, items: { include: { slab: true } } }
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
};

export const deleteAllCustomers = async (_req: Request, res: Response) => {
    try {
        await prisma.$transaction(async (tx) => {
            await tx.salesOrderItem.deleteMany({});
            await tx.invoice.deleteMany({});
            await tx.dispatch.deleteMany({});
            await tx.salesOrder.deleteMany({});
            await tx.transaction.deleteMany({ where: { customerId: { not: null } } });
            await tx.customer.deleteMany({});
        });
        res.json({ ok: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to clear customers' });
    }
};
