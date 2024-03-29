"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const User_1 = __importDefault(require("../controllers/User"));
// import getFromCache from '../controllers/redisCache';
const router = express_1.default.Router();
router.post('/register', User_1.default.register);
router.post('/login', User_1.default.login);
router.get('/stats', User_1.default.stats);
router.get('/all', User_1.default.allUsers);
router.delete('/delete/:id', User_1.default.deleteUser);
router.get("/:id/verify/:token", User_1.default.verifyEmail);
router.post("/reset-password", User_1.default.resetPasswordRequest);
router.put("/:id/reset-password/:token", User_1.default.resetPasswordWithToken);
router.get("/check-token/:token", User_1.default.checkToken);
// router.get("/get/cache", getFromCache);
exports.default = router;
