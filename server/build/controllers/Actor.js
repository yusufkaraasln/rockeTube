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
const redis_1 = __importDefault(require("redis"));
const Actor_1 = __importDefault(require("../models/Actor"));
const client = redis_1.default.createClient();
const createActor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const actor = new Actor_1.default({
        name: req.body.name,
        age: req.body.age,
        films: req.body.films,
        photo: req.body.photo
    });
    try {
        const result = yield actor.save();
        return res.status(201).json({
            message: "Actor created",
            createdActor: result
        });
    }
    catch (err) {
        res.status(500).json({
            error: err
        });
    }
});
const readActor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.actorId;
    try {
        const actor = yield Actor_1.default.findById(id)
            .populate("films")
            .select("-__v");
        if (actor) {
            return res.status(200).json({
                actor
            });
        }
        else {
            return res.status(404).json({
                message: "Actor not found"
            });
        }
    }
    catch (err) {
        res.status(500).json({
            error: err
        });
    }
});
const updateActor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.actorId;
    try {
        const result = yield Actor_1.default
            .findByIdAndUpdate(id, {
            $set: req.body
        }, { new: true })
            .populate("films");
        if (result) {
            return res.status(200).json({
                message: "Actor updated",
                updatedActor: result
            });
        }
        else {
            return res.status(404).json({
                message: "Actor not found"
            });
        }
    }
    catch (err) {
        res.status(500).json({
            error: err
        });
    }
});
const deleteActor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.actorId;
    try {
        const result = yield Actor_1.default.findByIdAndDelete(id);
        if (result) {
            return res.status(200).json({
                message: "Actor deleted",
                deletedActor: result
            });
        }
        else {
            return res.status(404).json({
                message: "Actor not found"
            });
        }
    }
    catch (err) {
        res.status(500).json({
            error: err
        });
    }
});
const readActors = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        client.get("actors", (err, actors) => __awaiter(void 0, void 0, void 0, function* () {
            if (err)
                console.log(err);
            if (actors) {
                return res.status(200).json({
                    actors: JSON.parse(actors)
                });
            }
            else {
                const actors = yield Actor_1.default.find()
                    .populate("films")
                    .select("-__v");
                client.setex("actors", 1800, JSON.stringify(actors));
                return res.status(200).json({
                    actors
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
    createActor,
    readActor,
    updateActor,
    deleteActor,
    readActors
};
