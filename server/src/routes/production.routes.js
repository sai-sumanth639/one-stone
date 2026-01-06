"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const production_controller_1 = require("../controllers/production.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.post('/process', auth_middleware_1.authenticateToken, production_controller_1.processBlockToSlabs);
router.get('/inventory', auth_middleware_1.authenticateToken, production_controller_1.getInventory);
exports.default = router;
//# sourceMappingURL=production.routes.js.map