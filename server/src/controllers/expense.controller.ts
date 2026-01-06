import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const createExpense = async (req: Request, res: Response) => {
  try {
    const expense = await prisma.expense.create({ data: req.body });
    await prisma.transaction.create({
      data: {
        amount: expense.amount,
        type: 'DEBIT',
        category: 'Expense',
        description: `Expense: ${expense.category}`,
      },
    });
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create expense' });
  }
};

export const getExpenses = async (req: Request, res: Response) => {
  try {
    const expenses = await prisma.expense.findMany();
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
};

