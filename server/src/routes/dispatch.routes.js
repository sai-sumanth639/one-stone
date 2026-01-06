"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const rbac_middleware_1 = require("../middleware/rbac.middleware");
const dispatch_controller_1 = require("../controllers/dispatch.controller");
const router = express_1.default.Router();
router.post('/', auth_middleware_1.authenticateToken, (0, rbac_middleware_1.authorize)(['ADMIN', 'MANAGER', 'SALES', 'PRODUCTION']), dispatch_controller_1.createDispatch);
router.patch('/:id/status', auth_middleware_1.authenticateToken, (0, rbac_middleware_1.authorize)(['ADMIN', 'MANAGER', 'SALES', 'PRODUCTION']), dispatch_controller_1.updateDispatchStatus);
router.get('/', auth_middleware_1.authenticateToken, (0, rbac_middleware_1.authorize)(['ADMIN', 'MANAGER', 'SALES', 'PRODUCTION', 'ACCOUNTANT']), dispatch_controller_1.getDispatches);
exports.default = router;
//# sourceMappingURL=dispatch.routes.js.map