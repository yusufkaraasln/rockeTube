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
const Company_1 = __importDefault(require("../models/Company"));
const createCompany = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const company = new Company_1.default({
        name: req.body.name,
        website: req.body.website,
        logo: req.body.logo,
        videos: req.body.videos
    });
    try {
        const result = yield company.save();
        return res.status(201).json({
            message: "Company created",
            createdCompany: result
        });
    }
    catch (err) {
        res.status(500).json({
            error: err
        });
    }
});
const readCompany = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.companyId;
    try {
        const company = yield Company_1.default.findById(id).populate({
            path: "videos",
            populate: [{
                    path: "actor",
                    model: "Actor"
                },
            ]
        }).select("-__v");
        // const companyWithoutVersion = { ...company?.toJSON() };
        // delete companyWithoutVersion.__v;
        if (company) {
            return res.status(200).json({
                // company: companyWithoutVersion
                company
            });
        }
        else {
            return res.status(404).json({
                message: "Company not found"
            });
        }
    }
    catch (err) {
        res.status(500).json({
            error: err
        });
    }
});
const updateCompany = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.companyId;
    try {
        const result = yield Company_1.default.findByIdAndUpdate(id, {
            $set: req.body
        }, { new: true }).populate("videos");
        return res.status(200).json({
            message: "Company updated",
            updatedCompany: result
        });
    }
    catch (err) {
        res.status(500).json({
            error: err
        });
    }
});
const deleteCompany = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.companyId;
    try {
        const result = yield Company_1.default.findByIdAndDelete(id);
        return res.status(200).json({
            message: "Company deleted",
            deletedCompany: result
        });
    }
    catch (err) {
        res.status(500).json({
            error: err
        });
    }
});
const redis_1 = __importDefault(require("redis"));
const client = redis_1.default.createClient();
const getCompanies = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        client.get("companies", (err, companies) => __awaiter(void 0, void 0, void 0, function* () {
            err && console.log(err);
            if (companies) {
                return res.status(200).json({
                    companies: JSON.parse(companies)
                });
            }
            else {
                const companies = yield Company_1.default.find().populate("videos");
                client.setex("companies", 1800, JSON.stringify(companies));
                return res.status(200).json({
                    companies
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
    createCompany,
    readCompany,
    updateCompany,
    deleteCompany,
    getCompanies
};
