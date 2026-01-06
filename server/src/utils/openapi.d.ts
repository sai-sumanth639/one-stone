export declare const openapiSpec: {
    openapi: string;
    info: {
        title: string;
        version: string;
    };
    servers: {
        url: string;
    }[];
    paths: {
        '/auth/login': {
            post: {
                summary: string;
            };
        };
        '/auth/register': {
            post: {
                summary: string;
            };
        };
        '/purchase/suppliers': {
            get: {
                summary: string;
            };
            post: {
                summary: string;
            };
        };
        '/purchase/blocks': {
            get: {
                summary: string;
            };
            post: {
                summary: string;
            };
        };
        '/production/process': {
            post: {
                summary: string;
            };
        };
        '/production/inventory': {
            get: {
                summary: string;
            };
        };
        '/sales/customers': {
            post: {
                summary: string;
            };
        };
        '/sales/orders': {
            get: {
                summary: string;
            };
            post: {
                summary: string;
            };
        };
        '/dispatch': {
            get: {
                summary: string;
            };
            post: {
                summary: string;
            };
        };
        '/dispatch/{id}/status': {
            patch: {
                summary: string;
            };
        };
        '/accounting/payments': {
            post: {
                summary: string;
            };
        };
        '/accounting/outstanding': {
            get: {
                summary: string;
            };
        };
        '/expenses': {
            get: {
                summary: string;
            };
            post: {
                summary: string;
            };
        };
        '/pnl/order/{orderId}': {
            get: {
                summary: string;
            };
        };
        '/pnl/block/{blockId}': {
            get: {
                summary: string;
            };
        };
        '/pnl/monthly': {
            get: {
                summary: string;
            };
        };
        '/dashboard/stats': {
            get: {
                summary: string;
            };
        };
    };
};
//# sourceMappingURL=openapi.d.ts.map