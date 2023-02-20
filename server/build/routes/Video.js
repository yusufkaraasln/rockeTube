"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import uploadVideo from '../controllers/UploadVideo';
const Video_1 = __importDefault(require("../controllers/Video"));
const router = express_1.default.Router();
router.post('/create', Video_1.default.createVideo);
router.get('/get/:videoId', Video_1.default.readVideo);
router.get('/get/', Video_1.default.getVideos);
router.put('/update/:videoId', Video_1.default.updateVideo);
router.delete('/delete/:videoId', Video_1.default.deleteVideo);
// router.put("/addVideo/:id",uploadVideo)
exports.default = router;
