import { NextFunction, Request, Response } from "express";

import Company from "../models/Company";
import mongoose from "mongoose";

const createCompany = async (req: Request, res: Response, next: NextFunction) => {
    const company = new Company({
        name: req.body.name,
        website: req.body.website,
        logo: req.body.logo,
        videos: req.body.videos
    });

    try {
        const result = await company.save();
        return res.status(201).json({
            message: "Company created",
            createdCompany: result
        });
    } catch (err) {
        res.status(500).json({
            error: err
        });
    }
}

const readCompany = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.companyId;

    try {
        const company = await Company.findById(id
        ).populate({
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
}

const updateCompany = async (req: Request, res: Response, next: NextFunction) => {

    const id = req.params.companyId;

    try {
        const result = await
            Company.findByIdAndUpdate(id, {
                $set: req.body
            }, { new: true }
            ).populate("videos");

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
}

const deleteCompany = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.companyId;

    try {
        const result = await Company.findByIdAndDelete(id);

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
}

import redis from "redis";
const client = redis.createClient();

const getCompanies = async (req: Request, res: Response, next: NextFunction) => {
    try {


        client.get("companies", async (err, companies) => {
            err && console.log(err);
            if (companies) {
                return res.status(200).json({
                    companies: JSON.parse(companies)
                });
            } else {
                const companies = await Company.find().populate("videos");
                client.setex("companies", 1800, JSON.stringify(companies));
                return res.status(200).json({
                    companies
                });
            }


        })




    }
    catch (err) {
        res.status(500).json({
            error: err
        });
    }
}

export default {
    createCompany,
    readCompany,
    updateCompany,
    deleteCompany,
    getCompanies
};



