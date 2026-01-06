"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const purchase_controller_1 = require("../controllers/purchase.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.post('/suppliers', auth_middleware_1.authenticateToken, purchase_controller_1.createSupplier);
router.get('/suppliers', auth_middleware_1.authenticateToken, purchase_controller_1.getSuppliers);
router.post('/blocks', auth_middleware_1.authenticateToken, purchase_controller_1.addBlock);
router.get('/blocks', auth_middleware_1.authenticateToken, purchase_controller_1.getBlocks);
exports.default = router;
//# sourceMappingURL=purchase.routes.js.map