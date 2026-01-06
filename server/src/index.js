"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const morgan_1 = __importDefault(require("morgan"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, morgan_1.default)('dev'));
app.get('/', (req, res) => {
    res.send('Marble ERP API is running');
});
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const purchase_routes_1 = __importDefault(require("./routes/purchase.routes"));
const production_routes_1 = __importDefault(require("./routes/production.routes"));
const sales_routes_1 = __importDefault(require("./routes/sales.routes"));
const dashboard_routes_1 = __importDefault(require("./routes/dashboard.routes"));
const dispatch_routes_1 = __importDefault(require("./routes/dispatch.routes"));
const accounting_routes_1 = __importDefault(require("./routes/accounting.routes"));
const expense_routes_1 = __importDefault(require("./routes/expense.routes"));
const pnl_routes_1 = __importDefault(require("./routes/pnl.routes"));
const openapi_1 = require("./utils/openapi");
app.use('/api/auth', auth_routes_1.default);
app.use('/api/purchase', purchase_routes_1.default);
app.use('/api/production', production_routes_1.default);
app.use('/api/sales', sales_routes_1.default);
app.use('/api/dashboard', dashboard_routes_1.default);
app.use('/api/dispatch', dispatch_routes_1.default);
app.use('/api/accounting', accounting_routes_1.default);
app.use('/api/expenses', expense_routes_1.default);
app.use('/api/pnl', pnl_routes_1.default);
app.use('/api/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(openapi_1.openapiSpec));
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map