"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = exports.S3_REGION = exports.S3_SECRET_KEY = exports.S3_ACCESS_KEY = exports.JWT_SECRET = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const MONGO_USERNAME = process.env.MONGO_USERNAME || "";
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || "";
exports.JWT_SECRET = process.env.JWT_SECRET ?
    process.env.JWT_SECRET
    : "";
const MONGO_URL = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@cluster0.3bz7d.mongodb.net/rocketube?retryWrites=true&w=majority`;
const SERVER_PORT = process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 3000;
exports.S3_ACCESS_KEY = process.env.S3_ACCESS_KEY ? process.env.S3_ACCESS_KEY : "";
exports.S3_SECRET_KEY = process.env.S3_SECRET_KEY ? process.env.S3_SECRET_KEY : "";
exports.S3_REGION = process.env.S3_REGION ? process.env.S3_REGION : "";
exports.config = {
    mongo: {
        url: MONGO_URL,
        options: {
            retryWrites: true,
            w: "majority"
        },
    },
    server: {
        port: SERVER_PORT,
    },
};
