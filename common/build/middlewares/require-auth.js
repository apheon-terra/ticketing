"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
var not_authorized_error_1 = require("../errors/not-authorized-error");
//rej req if usr is not logged in 
var requireAuth = function (req, res, next) {
    //v1
    // if (!req.currentUser) {
    //     return res.status(401).send();
    // }
    if (!req.currentUser) {
        throw new not_authorized_error_1.NotAuthorizedError();
    }
    next();
};
exports.requireAuth = requireAuth;
