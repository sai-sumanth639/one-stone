"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.monthlyProfit = exports.profitPerBlock = exports.profitPerOrder = void 0;
const express_1 = require("express");
const prisma_1 = __importDefault(require("../utils/prisma"));
const calcBlockCostPerSqFt = async (blockId) => {
    const block = await prisma_1.default.block.findUnique({ where: { id: blockId }, include: { slabs: true } });
    if (!block || block.slabs.length === 0)
        return 0;
    const totalSqFt = block.slabs.reduce((acc, s) => acc + s.sqFt, 0);
    return block.totalCost / totalSqFt;
};
const profitPerOrder = async (req, res) => {
    const { orderId } = req.params;
    try {
        const order = await prisma_1.default.salesOrder.findUnique({
            where: { id: orderId },
            include: { items: { include: { slab: { include: { block: true } } } } },
        });
        if (!order)
            return res.status(404).json({ error: 'Order not found' });
        let cost = 0;
        for (const item of order.items) {
            const cpsf = await calcBlockCostPerSqFt(item.slab.blockId);
            cost += cpsf * item.slab.sqFt;
        }
        const revenue = order.finalAmount;
        const profit = revenue - cost;
        res.json({ orderId, revenue, cost: parseFloat(cost.toFixed(2)), profit: parseFloat(profit.toFixed(2)) });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to compute order profit' });
    }
};
exports.profitPerOrder = profitPerOrder;
const profitPerBlock = async (req, res) => {
    const { blockId } = req.params;
    try {
        const slabsSold = await prisma_1.default.salesOrderItem.findMany({
            where: { slab: { blockId } },
            include: { slab: true, order: true },
        });
        const cpsf = await calcBlockCostPerSqFt(blockId);
        const revenue = slabsSold.reduce((acc, i) => acc + i.totalPrice, 0);
        const cost = slabsSold.reduce((acc, i) => acc + cpsf * i.slab.sqFt, 0);
        res.json({ blockId, revenue: parseFloat(revenue.toFixed(2)), cost: parseFloat(cost.toFixed(2)), profit: parseFloat((revenue - cost).toFixed(2)) });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to compute block profit' });
    }
};
exports.profitPerBlock = profitPerBlock;
const monthlyProfit = async (req, res) => {
    const { year, month } = req.query;
    const start = new Date(Number(year), Number(month) - 1, 1);
    const end = new Date(Number(year), Number(month), 0, 23, 59, 59, 999);
    try {
        const orders = await prisma_1.default.salesOrder.findMany({
            where: { orderDate: { gte: start, lte: end } },
            include: { items: { include: { slab: true } } },
        });
        let revenue = 0;
        let cost = 0;
        for (const order of orders) {
            revenue += order.finalAmount;
            for (const item of order.items) {
                const cpsf = await calcBlockCostPerSqFt(item.slab.blockId);
                cost += cpsf * item.slab.sqFt;
            }
        }
        const expenses = await prisma_1.default.expense.aggregate({
            _sum: { amount: true },
            where: { date: { gte: start, lte: end } },
        });
        const expenseTotal = expenses._sum.amount || 0;
        const profit = revenue - cost - expenseTotal;
        res.json({
            period: `${year}-${month}`,
            revenue: parseFloat(revenue.toFixed(2)),
            cost: parseFloat(cost.toFixed(2)),
            expenses: parseFloat(expenseTotal.toFixed(2)),
            profit: parseFloat(profit.toFixed(2)),
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to compute monthly profit' });
    }
};
exports.monthlyProfit = monthlyProfit;
//# sourceMappingURL=pnl.controller.js.map