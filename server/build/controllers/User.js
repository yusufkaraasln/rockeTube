"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkToken = exports.resetPasswordWithToken = exports.resetPasswordRequest = exports.verifyEmail = exports.deleteUser = exports.allUsers = exports.stats = exports.login = exports.register = void 0;
const User_1 = __importDefault(require("../models/User"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongoose_1 = __importDefault(require("mongoose"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const redis_1 = __importDefault(require("redis"));
const config_1 = require("../config/config");
const Token_1 = __importDefault(require("../models/Token"));
const crypto_1 = __importDefault(require("crypto"));
const sendMail_1 = __importDefault(require("../utils/sendMail"));
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const registeredUser = yield User_1.default.findOne({
            email: req.body.email
        });
        if (registeredUser && registeredUser.verified) {
            return res.status(409).json({
                message: "User already exists"
            });
        }
        else {
            yield (registeredUser === null || registeredUser === void 0 ? void 0 : registeredUser.remove());
            yield Token_1.default.deleteOne({ user: registeredUser === null || registeredUser === void 0 ? void 0 : registeredUser._id });
            const salt = yield bcrypt_1.default.genSalt(10);
            const hash = yield bcrypt_1.default.hash(req.body.password, salt);
            const user = new User_1.default(Object.assign(Object.assign({}, req.body), { _id: new mongoose_1.default.Types.ObjectId(), password: hash }));
            yield user.save();
            const token = yield (yield Token_1.default.create({
                user: user._id,
                token: crypto_1.default.randomBytes(16).toString("hex"),
            })).save();
            const url = `${process.env.BASE_URL}/api/user/${user._id}/verify/${token.token}`;
            yield (0, sendMail_1.default)(user.email, "Verify your email", `Please click on the following link to verify your email: ${url}`);
            res.status(201).json({
                message: "An email has been sent to your email address. Please verify your email address to complete the registration process.",
            });
        }
    }
    catch (error) {
        res.status(500).json({
            error
        });
    }
});
exports.register = register;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default
            .findOne({ email: req.body.email })
            .populate("favorites")
            .select("-__v");
        const passwordIsValid = yield bcrypt_1.default.compare(req.body.password, user.password);
        if (!passwordIsValid) {
            return res.status(401).json({
                message: "Auth failed"
            });
        }
        else if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        if (!user.verified) {
            let token = yield Token_1.default.findOne({ user: user._id });
            if (!token) {
                token = yield (yield Token_1.default.create({
                    user: user._id,
                    token: crypto_1.default.randomBytes(16).toString("hex"),
                })).save();
                const url = `${process.env.BASE_URL}/api/user/${user._id}/verify/${token.token}`;
                yield (0, sendMail_1.default)(user.email, "Verify your email", `Please click on the following link to verify your email: ${url}`);
            }
            return res.status(401).send({
                message: "Your account has not been verified. Please check your email for verification link.",
            });
        }
        const _a = user._doc, { password, __v } = _a, others = __rest(_a, ["password", "__v"]);
        const token = jsonwebtoken_1.default.sign({ id: user._id }, config_1.JWT_SECRET);
        res.cookie("access_token", token, {
            httpOnly: true,
        }).status(200).json({
            message: "Auth successful",
            user: others
        });
    }
    catch (err) {
        res.status(500).json({
            errorrr: err
        });
    }
});
exports.login = login;
const stats = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const thirtyDaysAgo = new Date(new Date().setDate(new Date().getDate() - 30));
    User_1.default.aggregate([
        {
            $match: {
                createdAt: { $gte: thirtyDaysAgo }
            }
        },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                count: { $sum: 1 }
            }
        },
        {
            $sort: {
                _id: 1
            }
        }
    ])
        .exec()
        .then(result => {
        res.json(result);
    })
        .catch(err => {
        res.status(500).json({ error: err });
    });
});
exports.stats = stats;
const client = redis_1.default.createClient();
const allUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        client.get("users", (err, users) => __awaiter(void 0, void 0, void 0, function* () {
            err && console.log(err);
            if (users) {
                return res.status(200).json({
                    users: JSON.parse(users)
                });
            }
            else {
                const data = yield User_1.default.find().select("-password -__v");
                client.setex("users", 1800, JSON.stringify(data));
                return res.status(200).json({
                    users: data
                });
            }
        }));
    }
    catch (error) {
        res.status(500).json({ error });
    }
});
exports.allUsers = allUsers;
const deleteUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedUser = yield User_1.default.findByIdAndDelete(req.params.id);
        res.status(200).json(deletedUser);
    }
    catch (error) {
        res.status(500).json({ error });
    }
});
exports.deleteUser = deleteUser;
const verifyEmail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findOne({ _id: req.params.id });
        if (!user)
            return res.status(404).json({ message: "invalid link" });
        const token = yield Token_1.default.findOne({
            user: req.params.id,
            token: req.params.token
        });
        if (!token)
            return res.status(404).json({ message: "invalid link" });
        yield User_1.default.findByIdAndUpdate(user._id, { verified: true });
        yield token.remove();
        res.status(200).json({ message: "Your email has been verified" });
        console.log("Your email has been verified");
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
});
exports.verifyEmail = verifyEmail;
const resetPasswordRequest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findOne({ email: req.body.email });
        if (!user)
            return res.status(404).json({ message: "User not found" });
        const token = yield Token_1.default.findOne({ user: user._id });
        if (token)
            yield token.remove();
        const newToken = yield (yield Token_1.default.create({
            user: user._id,
            token: crypto_1.default.randomBytes(16).toString("hex"),
        })).save();
        const url = `http://localhost:3000/user/${user._id}/reset-password/${newToken.token}`;
        yield (0, sendMail_1.default)(user.email, "Reset your password", `Please click on the following link to reset your password: ${url}`);
        res.status(200).json({ message: "An email has been sent to your email address. Please click on the link to reset your password." });
    }
    catch (error) {
        res.status(500).json({ error });
        console.log(error);
    }
});
exports.resetPasswordRequest = resetPasswordRequest;
const resetPasswordWithToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findOne({ _id: req.params.id });
        if (!user)
            return res.status(404).json({ message: "Invalid link" });
        const token = yield Token_1.default.findOne({
            user: req.params.id,
            token: req.params.token
        });
        if (!token)
            return res.status(404).json({ message: "Invalid link" });
        // Check if password and confirmPassword match
        if (req.body.password !== req.body.rePassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }
        // Update user password and remove token
        const salt = yield bcrypt_1.default.genSalt(10);
        const hash = yield bcrypt_1.default.hash(req.body.password, salt);
        yield User_1.default.findByIdAndUpdate(user._id, {
            $set: {
                password: hash,
            },
        }, { new: true });
        yield token.remove();
        res.status(200).json({ message: "Your password has been updated" });
        console.log("Your password has been updated");
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
});
exports.resetPasswordWithToken = resetPasswordWithToken;
const checkToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = yield Token_1.default.findOne({
            token: req.params.token,
        });
        if (!token)
            return res.status(404).json({ message: "Invalid link" });
        res.status(200).json({ message: "Valid link" });
    }
    catch (error) {
        res.status(500).json({ error });
    }
});
exports.checkToken = checkToken;
exports.default = {
    register: exports.register, login: exports.login, stats: exports.stats,
    allUsers: exports.allUsers,
    deleteUser: exports.deleteUser,
    verifyEmail: exports.verifyEmail,
    resetPasswordRequest: exports.resetPasswordRequest,
    resetPasswordWithToken: exports.resetPasswordWithToken,
    checkToken: exports.checkToken
};
