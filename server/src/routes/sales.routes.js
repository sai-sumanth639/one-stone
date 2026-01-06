"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sales_controller_1 = require("../controllers/sales.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.post('/customers', auth_middleware_1.authenticateToken, sales_controller_1.createCustomer);
router.get('/customers', auth_middleware_1.authenticateToken, sales_controller_1.getCustomers);
router.post('/orders', auth_middleware_1.authenticateToken, sales_controller_1.createOrder);
router.get('/orders', auth_middleware_1.authenticateToken, sales_controller_1.getOrders);
exports.default = router;
//# sourceMappingURL=sales.routes.js.map
