import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        const [
            totalInventoryValue, 
            totalSlabsAvailable,
            salesToday,
            monthlyRevenue,
            pendingPayments
        ] = await Promise.all([
            prisma.block.aggregate({
                _sum: { totalCost: true },
                where: { status: { in: ['IN_STOCK', 'PROCESSING'] } }
            }),
            prisma.slab.count({ where: { status: 'AVAILABLE' } }),
            prisma.salesOrder.aggregate({
                _sum: { finalAmount: true },
                where: { 
                    orderDate: { 
                        gte: new Date(new Date().setHours(0,0,0,0)) 
                    } 
                }
            }),
            prisma.salesOrder.aggregate({
                _sum: { finalAmount: true },
                where: {
                    orderDate: {
                        gte: new Date(new Date().setDate(1))
                    }
                }
            }),
            prisma.invoice.aggregate({
                _sum: { amount: true },
                where: { status: { not: 'PAID' } }
            })
        ]);

        const invoices = await prisma.invoice.findMany({ where: { status: { not: 'PAID' } } });
        const pendingAmount = invoices.reduce((acc, inv) => acc + (inv.amount - inv.paidAmount), 0);

        res.json({
            inventoryValue: totalInventoryValue._sum.totalCost || 0,
            slabsAvailable: totalSlabsAvailable,
            salesToday: salesToday._sum.finalAmount || 0,
            monthlyRevenue: monthlyRevenue._sum.finalAmount || 0,
            pendingPayments: pendingAmount
        });

    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch dashboard stats' });
    }
};

export const getDashboardTrends = async (req: Request, res: Response) => {
    try {
        const months = [];
        const now = new Date();
        const countParam = Number(req.query.months || 12);
        const count = isNaN(countParam) ? 12 : Math.max(1, Math.min(24, countParam));
        for (let i = count - 1; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            months.push({ year: d.getFullYear(), month: d.getMonth() + 1 });
        }
        const data = [];
        for (const m of months) {
            const start = new Date(m.year, m.month - 1, 1);
            const end = new Date(m.year, m.month, 0, 23, 59, 59, 999);
            const revenueAgg = await prisma.salesOrder.aggregate({
                _sum: { finalAmount: true },
                where: { orderDate: { gte: start, lte: end } }
            });
            const expensesAgg = await prisma.expense.aggregate({
                _sum: { amount: true },
                where: { date: { gte: start, lte: end } }
            });
            const items = await prisma.salesOrderItem.findMany({
                where: { order: { orderDate: { gte: start, lte: end } } },
                include: { slab: true }
            });
            let cost = 0;
            for (const it of items) {
                const slab = it.slab;
                const block = await prisma.block.findUnique({ where: { id: slab.blockId }, include: { slabs: true } });
                if (!block || block.slabs.length === 0) continue;
                const totalSqFt = block.slabs.reduce((acc, s) => acc + s.sqFt, 0);
                const cpsf = block.totalCost / totalSqFt;
                cost += cpsf * slab.sqFt;
            }
            const revenue = revenueAgg._sum.finalAmount || 0;
            const expenses = expensesAgg._sum.amount || 0;
            data.push({
                label: `${String(m.month).padStart(2,'0')}/${String(m.year).slice(2)}`,
                revenue: Number(revenue.toFixed(2)),
                cost: Number(cost.toFixed(2)),
                expenses: Number(expenses.toFixed(2)),
                profit: Number((revenue - cost - expenses).toFixed(2))
            });
        }
        const invAvailable = await prisma.slab.count({ where: { status: 'AVAILABLE' } });
        const invReserved = await prisma.slab.count({ where: { status: 'RESERVED' } });
        const invSold = await prisma.slab.count({ where: { status: 'SOLD' } });
        const invDamaged = await prisma.slab.count({ where: { status: 'DAMAGED' } });
        res.json({
            monthly: data,
            inventory: [
                { name: 'Available', value: invAvailable },
                { name: 'Reserved', value: invReserved },
                { name: 'Sold', value: invSold },
                { name: 'Damaged', value: invDamaged }
            ]
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch dashboard trends' });
    }
};
