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
const Video_1 = __importDefault(require("../models/Video"));
const Actor_1 = __importDefault(require("../models/Actor"));
const Company_1 = __importDefault(require("../models/Company"));
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const redis_1 = __importDefault(require("redis"));
const client = redis_1.default.createClient();
const s3 = new aws_sdk_1.default.S3({
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
    region: process.env.S3_REGION
});
const createVideo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const video = new Video_1.default({
        title: req.body.title,
        description: req.body.description,
        video_url: req.body.video_url,
        cover_url: req.body.cover_url,
        actors: req.body.actors,
        company: req.body.company
    });
    try {
        // add video to actor
        const actors = yield Actor_1.default.find({ _id: { $in: video === null || video === void 0 ? void 0 : video.actors } });
        actors === null || actors === void 0 ? void 0 : actors.forEach((actor) => __awaiter(void 0, void 0, void 0, function* () {
            actor === null || actor === void 0 ? void 0 : actor.films.push(video === null || video === void 0 ? void 0 : video._id);
            yield (actor === null || actor === void 0 ? void 0 : actor.save());
        }));
        // add video to company
        const company = yield Company_1.default.findById(video === null || video === void 0 ? void 0 : video.company);
        company === null || company === void 0 ? void 0 : company.videos.push(video === null || video === void 0 ? void 0 : video._id);
        yield (company === null || company === void 0 ? void 0 : company.save());
        const result = yield video.save();
        return res.status(201).json({
            message: 'Video created',
            createdVideo: result
        });
    }
    catch (err) {
        res.status(500).json({
            error: err
        });
    }
});
const readVideo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.videoId;
    try {
        const video = yield Video_1.default
            .findById(id)
            .populate('actors')
            .populate('company')
            .populate('comments')
            .populate('favorites')
            .select("-__v");
        if (video) {
            return res.status(200).json({
                video
            });
        }
        else {
            return res.status(404).json({
                message: 'Video not found'
            });
        }
    }
    catch (err) {
        res.status(500).json({
            error: err
        });
    }
});
const updateVideo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.videoId;
    try {
        const result = yield Video_1.default.findByIdAndUpdate(id, {
            $set: req.body
        }, { new: true });
        return res.status(200).json({
            message: 'Video updated',
            updatedVideo: result
        });
    }
    catch (err) {
        res.status(500).json({
            error: err
        });
    }
});
const deleteVideo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.videoId;
    try {
        const result = yield Video_1.default.findByIdAndDelete(id);
        return res.status(200).json({
            message: 'Video deleted',
            deletedVideo: result
        });
    }
    catch (err) {
        res.status(500).json({
            error: err
        });
    }
});
const getVideos = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        client.get('videos', (err, videos) => __awaiter(void 0, void 0, void 0, function* () {
            err && console.log(err);
            if (videos) {
                return res.status(200).json({
                    videos: JSON.parse(videos)
                });
            }
            else {
                const videos = yield Video_1.default.find()
                    .populate('actors')
                    .populate('company')
                    .populate('comments')
                    .populate('favorites')
                    .select("-__v");
                client.setex('videos', 1800, JSON.stringify(videos));
                return res.status(200).json({
                    videos
                });
            }
        }));
    }
    catch (err) {
        res.status(500).json({
            error: err
        });
    }
});
exports.default = {
    createVideo,
    readVideo,
    updateVideo,
    deleteVideo,
    getVideos
};
