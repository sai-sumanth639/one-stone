"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const rbac_middleware_1 = require("../middleware/rbac.middleware");
const pnl_controller_1 = require("../controllers/pnl.controller");
const router = express_1.default.Router();
router.get('/order/:orderId', auth_middleware_1.authenticateToken, (0, rbac_middleware_1.authorize)(['ADMIN', 'MANAGER', 'ACCOUNTANT']), pnl_controller_1.profitPerOrder);
router.get('/block/:blockId', auth_middleware_1.authenticateToken, (0, rbac_middleware_1.authorize)(['ADMIN', 'MANAGER', 'ACCOUNTANT']), pnl_controller_1.profitPerBlock);
router.get('/monthly', auth_middleware_1.authenticateToken, (0, rbac_middleware_1.authorize)(['ADMIN', 'MANAGER', 'ACCOUNTANT']), pnl_controller_1.monthlyProfit);
exports.default = router;
//# sourceMappingURL=pnl.routes.js.map