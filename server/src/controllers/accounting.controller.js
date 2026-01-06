"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOutstanding = exports.recordPayment = void 0;
const express_1 = require("express");
const prisma_1 = __importDefault(require("../utils/prisma"));
const recordPayment = async (req, res) => {
    const { invoiceId, amount, paymentMode, referenceNo } = req.body;
    try {
        const result = await prisma_1.default.$transaction(async (tx) => {
            const invoice = await tx.invoice.findUnique({ where: { id: invoiceId } });
            if (!invoice)
                throw new Error('Invoice not found');
            const newPaid = invoice.paidAmount + Number(amount);
            const status = newPaid >= invoice.amount ? 'PAID' : 'PARTIAL';
            const updatedInvoice = await tx.invoice.update({
                where: { id: invoiceId },
                data: { paidAmount: newPaid, status },
            });
            const txn = await tx.transaction.create({
                data: {
                    amount: Number(amount),
                    type: 'CREDIT',
                    category: 'Sales',
                    invoiceId,
                    paymentMode,
                    referenceNo,
                    description: `Payment received for ${updatedInvoice.invoiceNumber}`,
                },
            });
            return { invoice: updatedInvoice, transaction: txn };
        });
        res.status(201).json(result);
    }
    catch (error) {
        res.status(400).json({ error: error.message || 'Failed to record payment' });
    }
};
exports.recordPayment = recordPayment;
const getOutstanding = async (req, res) => {
    try {
        const invoices = await prisma_1.default.invoice.findMany({
            where: { status: { not: 'PAID' } },
            include: { order: { include: { customer: true } } },
        });
        const data = invoices.map((i) => ({
            invoiceId: i.id,
            invoiceNumber: i.invoiceNumber,
            customer: i.order.customer.name,
            amount: i.amount,
            paidAmount: i.paidAmount,
            pending: i.amount - i.paidAmount,
            status: i.status,
        }));
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch outstanding invoices' });
    }
};
exports.getOutstanding = getOutstanding;
//# sourceMappingURL=accounting.controller.js.map