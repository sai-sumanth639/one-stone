"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBlocks = exports.addBlock = exports.getSuppliers = exports.createSupplier = void 0;
const express_1 = require("express");
const prisma_1 = __importDefault(require("../utils/prisma"));
const createSupplier = async (req, res) => {
    try {
        const supplier = await prisma_1.default.supplier.create({
            data: req.body,
        });
        res.status(201).json(supplier);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create supplier' });
    }
};
exports.createSupplier = createSupplier;
const getSuppliers = async (req, res) => {
    try {
        const suppliers = await prisma_1.default.supplier.findMany();
        res.json(suppliers);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch suppliers' });
    }
};
exports.getSuppliers = getSuppliers;
const addBlock = async (req, res) => {
    try {
        const { supplierId, blockNumber, purchaseDate, length, height, width, purchasePrice, transportCost } = req.body;
        // Calculate total cost or other derived fields if necessary, but DB stores raw data mostly.
        // Total Cost is stored in schema as calculated field?
        // Schema: totalCost Float // Calculated.
        // We should calculate it here or let frontend send it. Best to calculate here to ensure consistency.
        const totalCost = Number(purchasePrice) + Number(transportCost);
        const block = await prisma_1.default.block.create({
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add block' });
    }
};
exports.addBlock = addBlock;
const getBlocks = async (req, res) => {
    try {
        const blocks = await prisma_1.default.block.findMany({
            include: { supplier: true }
        });
        res.json(blocks);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch blocks' });
    }
};
exports.getBlocks = getBlocks;
//# sourceMappingURL=purchase.controller.js.map