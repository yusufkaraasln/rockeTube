import { NextFunction, Request, Response } from "express";
import User, { IUserModel } from "../models/User";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import redis from "redis";
import { JWT_SECRET } from "../config/config";

export const register = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.password, salt);

        const user = new User({
            ...req.body,
            _id: new mongoose.Types.ObjectId(),
            password: hash
        })

        const result = await user.save();
        res.status(201).json({
            message: "User created",
            createdUser: result
        });
    } catch (error) {
        res.status(500).json({
            error
        });
    }



}

export const login = async (req: Request, res: Response, next: NextFunction) => {


    try {
        const user: any = await User
            .findOne({ email: req.body.email })
            .populate("favorites")
            .select("-__v")

        const passwordIsValid = await bcrypt.compare(req.body.password, user.password);

        if (!passwordIsValid) {
            return res.status(401).json({
                message: "Auth failed"
            });
        } else if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }




        const { password, __v, ...others } = user._doc;

        const token = jwt.sign({ id: user._id }, JWT_SECRET)


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
}


export const stats = async (req: Request, res: Response, next: NextFunction) => {
    const thirtyDaysAgo = new Date(new Date().setDate(new Date().getDate() - 30));

    User.aggregate([
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
}

const client = redis.createClient();

export const allUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {


        client.get("users", async (err, users) => {
            err && console.log(err);

            if (users) {
                return res.status(200).json({
                    users: JSON.parse(users)
                });
            } else {
                const data = await User.find().select("-password -__v");
                client.setex("users", 1800, JSON.stringify(data));
                return res.status(200).json({
                    users: data
                });


            }


        })

    } catch (error) {
        res.status(500).json({ error });
    }
}





export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const deletedUser = await User.findByIdAndDelete(req.params.id);
        res.status(200).json(deletedUser);


    }
    catch (error) {
        res.status(500).json({ error });
    }


}





export default {
    register, login, stats,
    allUsers,
    deleteUser
};
