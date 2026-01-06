"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDispatches = exports.updateDispatchStatus = exports.createDispatch = void 0;
const express_1 = require("express");
const prisma_1 = __importDefault(require("../utils/prisma"));
const createDispatch = async (req, res) => {
    const { orderId, driverName, vehicleNumber, status } = req.body;
    try {
        const result = await prisma_1.default.$transaction(async (tx) => {
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
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create dispatch' });
    }
};
exports.createDispatch = createDispatch;
const updateDispatchStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const dispatch = await prisma_1.default.dispatch.update({
            where: { id },
            data: { status },
        });
        if (status === 'Delivered') {
            await prisma_1.default.salesOrder.update({
                where: { id: dispatch.orderId },
                data: { status: 'COMPLETED' },
            });
        }
        res.json(dispatch);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update dispatch status' });
    }
};
exports.updateDispatchStatus = updateDispatchStatus;
const getDispatches = async (req, res) => {
    try {
        const list = await prisma_1.default.dispatch.findMany({ include: { order: true } });
        res.json(list);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch dispatches' });
    }
};
exports.getDispatches = getDispatches;
//# sourceMappingURL=dispatch.controller.js.map