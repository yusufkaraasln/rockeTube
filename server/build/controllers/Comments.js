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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Comments_1 = __importDefault(require("../models/Comments"));
const makeComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = new Comments_1.default({
        comment: req.body.comment,
        user: req.body.user
    });
    try {
        const result = yield comment.save();
        res.status(201).json({
            message: "Comment created",
            createdComment: result
        });
    }
    catch (err) {
        res.status(500).json({
            error: err
        });
    }
});
const readComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.commentId;
    try {
        const comment = yield Comments_1.default.findById(id).populate("user");
        if (comment) {
            return res.status(200).json({
                comment
            });
        }
        else {
            return res.status(404).json({
                message: "Comment not found"
            });
        }
    }
    catch (err) {
        res.status(500).json({
            error: err
        });
    }
});
exports.default = {
    makeComment,
    readComment
};
