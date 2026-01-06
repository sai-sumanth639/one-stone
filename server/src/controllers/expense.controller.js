"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExpenses = exports.createExpense = void 0;
const express_1 = require("express");
const prisma_1 = __importDefault(require("../utils/prisma"));
const createExpense = async (req, res) => {
    try {
        const expense = await prisma_1.default.expense.create({ data: req.body });
        await prisma_1.default.transaction.create({
            data: {
                amount: expense.amount,
                type: 'DEBIT',
                category: 'Expense',
                description: `Expense: ${expense.category}`,
            },
        });
        res.status(201).json(expense);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create expense' });
    }
};
exports.createExpense = createExpense;
const getExpenses = async (req, res) => {
    try {
        const expenses = await prisma_1.default.expense.findMany();
        res.json(expenses);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch expenses' });
    }
};
exports.getExpenses = getExpenses;
//# sourceMappingURL=expense.controller.js.map