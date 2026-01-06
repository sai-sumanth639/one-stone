"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = void 0;
const express_1 = require("express");
const prisma_1 = __importDefault(require("../utils/prisma"));
const getDashboardStats = async (req, res) => {
    try {
        const [totalInventoryValue, totalSlabsAvailable, salesToday, monthlyRevenue, pendingPayments] = await Promise.all([
            // Total Inventory Value (Cost or Selling Price? Usually cost for internal, or potential revenue. Let's use cost from blocks or estimated value)
            // For now, let's sum up sqFt * some avg price or just count slabs.
            // Let's assume we want count for now as value is hard without cost per slab (which comes from block).
            // We can sum block totalCost.
            prisma_1.default.block.aggregate({
                _sum: { totalCost: true },
                where: { status: { in: ['IN_STOCK', 'PROCESSING'] } } // Only active blocks
            }),
            prisma_1.default.slab.count({ where: { status: 'AVAILABLE' } }),
            // Sales Today
            prisma_1.default.salesOrder.aggregate({
                _sum: { finalAmount: true },
                where: {
                    orderDate: {
                        gte: new Date(new Date().setHours(0, 0, 0, 0))
                    }
                }
            }),
            // Monthly Revenue
            prisma_1.default.salesOrder.aggregate({
                _sum: { finalAmount: true },
                where: {
                    orderDate: {
                        gte: new Date(new Date().setDate(1)) // 1st of this month
                    }
                }
            }),
            // Pending Payments (Unpaid Invoices)
            prisma_1.default.invoice.aggregate({
                _sum: { amount: true }, // Should be amount - paidAmount
                where: { status: { not: 'PAID' } }
            })
        ]);
        // Calculate pending accurately
        const invoices = await prisma_1.default.invoice.findMany({ where: { status: { not: 'PAID' } } });
        const pendingAmount = invoices.reduce((acc, inv) => acc + (inv.amount - inv.paidAmount), 0);
        res.json({
            inventoryValue: totalInventoryValue._sum.totalCost || 0,
            slabsAvailable: totalSlabsAvailable,
            salesToday: salesToday._sum.finalAmount || 0,
            monthlyRevenue: monthlyRevenue._sum.finalAmount || 0,
            pendingPayments: pendingAmount
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch dashboard stats' });
    }
};
exports.getDashboardStats = getDashboardStats;
//# sourceMappingURL=dashboard.controller.js.map