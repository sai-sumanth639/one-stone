"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrders = exports.createOrder = exports.createCustomer = void 0;
const express_1 = require("express");
const prisma_1 = __importDefault(require("../utils/prisma"));
const createCustomer = async (req, res) => {
    try {
        const customer = await prisma_1.default.customer.create({ data: req.body });
        res.status(201).json(customer);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create customer' });
    }
};
exports.createCustomer = createCustomer;
const createOrder = async (req, res) => {
    const { customerId, items, discount, taxAmount } = req.body;
    // items: [{ slabId, pricePerSqFt }]
    try {
        const result = await prisma_1.default.$transaction(async (tx) => {
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
    }
    catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message || 'Failed to create order' });
    }
};
exports.createOrder = createOrder;
const getOrders = async (req, res) => {
    try {
        const orders = await prisma_1.default.salesOrder.findMany({
            include: { customer: true, items: { include: { slab: true } } }
        });
        res.json(orders);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
};
exports.getOrders = getOrders;
//# sourceMappingURL=sales.controller.js.map