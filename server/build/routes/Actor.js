"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Actor_1 = __importDefault(require("../controllers/Actor"));
const router = express_1.default.Router();
router.post('/create', Actor_1.default.createActor);
router.get('/get/:actorId', Actor_1.default.readActor);
router.get('/get/', Actor_1.default.readActors);
router.put('/update/:actorId', Actor_1.default.updateActor);
router.delete('/delete/:actorId', Actor_1.default.deleteActor);
exports.default = router;
