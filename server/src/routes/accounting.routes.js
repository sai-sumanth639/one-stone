"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const rbac_middleware_1 = require("../middleware/rbac.middleware");
const accounting_controller_1 = require("../controllers/accounting.controller");
const router = express_1.default.Router();
router.post('/payments', auth_middleware_1.authenticateToken, (0, rbac_middleware_1.authorize)(['ADMIN', 'ACCOUNTANT', 'MANAGER']), accounting_controller_1.recordPayment);
router.get('/outstanding', auth_middleware_1.authenticateToken, (0, rbac_middleware_1.authorize)(['ADMIN', 'ACCOUNTANT', 'MANAGER', 'SALES']), accounting_controller_1.getOutstanding);
exports.default = router;
//# sourceMappingURL=accounting.routes.js.map