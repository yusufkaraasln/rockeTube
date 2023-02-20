"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Company_1 = __importDefault(require("../controllers/Company"));
const router = express_1.default.Router();
router.post('/create', Company_1.default.createCompany);
router.get('/get/:companyId', Company_1.default.readCompany);
router.get('/get/', Company_1.default.getCompanies);
router.put('/update/:companyId', Company_1.default.updateCompany);
router.delete('/delete/:companyId', Company_1.default.deleteCompany);
exports.default = router;
