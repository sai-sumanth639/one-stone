"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = void 0;
const express_1 = require("express");
const auth_middleware_1 = require("./auth.middleware");
const authorize = (roles) => (req, res, next) => {
    if (!req.user)
        return res.sendStatus(401);
    if (!roles.includes(req.user.role))
        return res.sendStatus(403);
    next();
};
exports.authorize = authorize;
//# sourceMappingURL=rbac.middleware.js.map