"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config/config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Logging_1 = __importDefault(require("../library/Logging"));
const verify = (req, res, next) => {
    const token = req.cookies.access_token;
    !token && next(Logging_1.default.error("You are not authenticated"));
    jsonwebtoken_1.default.verify(token, config_1.JWT_SECRET, (err, user) => {
        err && next(Logging_1.default.error("You are not authenticated"));
        req.user = user;
        next();
    });
};
exports.default = verify;
