"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.currentUser = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var currentUser = function (req, res, next) {
    var _a;
    //check first if session is defined then if it is check if we have a jwt property formed/defined
    // if x || y
    if (!((_a = req.session) === null || _a === void 0 ? void 0 : _a.jwt)) {
        return next(); //move to next middleware
    }
    try { //decode it
        var payload = jsonwebtoken_1.default.verify(req.session.jwt, process.env.JWT_KEY //ts proofed
        );
        req.currentUser = payload; //a property to describe who the current user is inside an express application 
    }
    catch (err) { }
    next(); //whether or not we decode or throw error we still want to continue to next middleware
};
exports.currentUser = currentUser;
