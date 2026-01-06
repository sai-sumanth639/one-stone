"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.openapiSpec = void 0;
exports.openapiSpec = {
    openapi: '3.0.0',
    info: {
        title: 'Marble ERP API',
        version: '1.0.0',
    },
    servers: [{ url: '/api' }],
    paths: {
        '/auth/login': { post: { summary: 'Login' } },
        '/auth/register': { post: { summary: 'Register' } },
        '/purchase/suppliers': {
            get: { summary: 'List suppliers' },
            post: { summary: 'Create supplier' },
        },
        '/purchase/blocks': {
            get: { summary: 'List blocks' },
            post: { summary: 'Create block' },
        },
        '/production/process': { post: { summary: 'Process block to slabs' } },
        '/production/inventory': { get: { summary: 'List available slabs' } },
        '/sales/customers': { post: { summary: 'Create customer' } },
        '/sales/orders': { get: { summary: 'List orders' }, post: { summary: 'Create order' } },
        '/dispatch': { get: { summary: 'List dispatch' }, post: { summary: 'Create dispatch' } },
        '/dispatch/{id}/status': { patch: { summary: 'Update dispatch status' } },
        '/accounting/payments': { post: { summary: 'Record payment' } },
        '/accounting/outstanding': { get: { summary: 'Outstanding invoices' } },
        '/expenses': { get: { summary: 'List expenses' }, post: { summary: 'Create expense' } },
        '/pnl/order/{orderId}': { get: { summary: 'Profit per order' } },
        '/pnl/block/{blockId}': { get: { summary: 'Profit per block' } },
        '/pnl/monthly': { get: { summary: 'Monthly profit' } },
        '/dashboard/stats': { get: { summary: 'Dashboard stats' } },
    },
};
//# sourceMappingURL=openapi.js.map