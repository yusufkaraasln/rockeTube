"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Comments_1 = __importDefault(require("../controllers/Comments"));
const router = express_1.default.Router();
router.post('/create', Comments_1.default.makeComment);
router.get('/get/:commentId', Comments_1.default.readComment);
// router.get('/get/', controller.getVideos);
// router.put('/update/:videoId',  controller.updateVideo);
// router.delete('/delete/:videoId', controller.deleteVideo);
exports.default = router;
