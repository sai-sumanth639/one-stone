"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const rbac_middleware_1 = require("../middleware/rbac.middleware");
const expense_controller_1 = require("../controllers/expense.controller");
const router = express_1.default.Router();
router.post('/', auth_middleware_1.authenticateToken, (0, rbac_middleware_1.authorize)(['ADMIN', 'ACCOUNTANT', 'MANAGER']), expense_controller_1.createExpense);
router.get('/', auth_middleware_1.authenticateToken, (0, rbac_middleware_1.authorize)(['ADMIN', 'ACCOUNTANT', 'MANAGER']), expense_controller_1.getExpenses);
exports.default = router;
//# sourceMappingURL=expense.routes.js.map