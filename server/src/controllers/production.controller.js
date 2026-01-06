"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInventory = exports.processBlockToSlabs = void 0;
const express_1 = require("express");
const prisma_1 = __importDefault(require("../utils/prisma"));
const processBlockToSlabs = async (req, res) => {
    const { blockId, slabs } = req.body; // slabs is array of { slabNo, length, width, thickness, finish }
    try {
        // Transaction: Update Block Status AND Create Slabs
        const result = await prisma_1.default.$transaction(async (tx) => {
            // 1. Update Block
            const block = await tx.block.update({
                where: { id: blockId },
                data: { status: 'PROCESSED' }
            });
            // 2. Create Slabs
            const createdSlabs = [];
            for (const slab of slabs) {
                // Calculate sqFt
                // Assuming dimensions are in inches and we want sqFt.
                // Formula: (Length * Width) / 144
                const sqFt = (Number(slab.length) * Number(slab.width)) / 144;
                const newSlab = await tx.slab.create({
                    data: {
                        blockId,
                        slabNo: slab.slabNo,
                        length: Number(slab.length),
                        width: Number(slab.width),
                        thickness: Number(slab.thickness),
                        sqFt: parseFloat(sqFt.toFixed(2)),
                        finish: slab.finish,
                        status: 'AVAILABLE'
                    }
                });
                createdSlabs.push(newSlab);
            }
            return { block, createdSlabs };
        });
        res.status(201).json(result);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to process block' });
    }
};
exports.processBlockToSlabs = processBlockToSlabs;
const getInventory = async (req, res) => {
    try {
        const slabs = await prisma_1.default.slab.findMany({
            where: { status: 'AVAILABLE' },
            include: { block: true }
        });
        res.json(slabs);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch inventory' });
    }
};
exports.getInventory = getInventory;
//# sourceMappingURL=production.controller.js.map