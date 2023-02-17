import { NextFunction, Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import redis from "redis";
import { JWT_SECRET } from "../config/config";
import Token from "../models/Token";
import crypto from "crypto";
import sendEmail from "../utils/sendMail";

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const registeredUser = await User.findOne({
            email: req.body.email
        });

        if (registeredUser && registeredUser.verified) {
            return res.status(409).json({
                message: "User already exists"
            })

        } else {

            await registeredUser?.remove();
            await Token.deleteOne({ user: registeredUser?._id });

            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(req.body.password, salt);

            const user = new User({
                ...req.body,
                _id: new mongoose.Types.ObjectId(),
                password: hash
            })

            await user.save();

            const token = await (await Token.create({
                user: user._id,
                token: crypto.randomBytes(16).toString("hex"),
            })).save()


            const url = `${process.env.BASE_URL}/api/user/${user._id}/verify/${token.token}`

            await sendEmail(user.email, "Verify your email", `Please click on the following link to verify your email: ${url}`)

            res.status(201).json({
                message: "An email has been sent to your email address. Please verify your email address to complete the registration process.",
            });



        }




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

        if (!user.verified) {
            let token = await Token.findOne({ user: user._id });
            if (!token) {
                token = await (await Token.create({
                    user: user._id,
                    token: crypto.randomBytes(16).toString("hex"),
                })).save()

                const url = `${process.env.BASE_URL}/api/user/${user._id}/verify/${token.token}`
                await sendEmail(user.email, "Verify your email", `Please click on the following link to verify your email: ${url}`)

            }

            return res.status(401).send({
                message: "Your account has not been verified. Please check your email for verification link.",
            })


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

export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {



    try {
        const user = await User.findOne({ _id: req.params.id })
        if (!user) return res.status(404).json({ message: "invalid link" })

        const token = await Token.findOne({
            user: req.params.id,
            token: req.params.token
        })
        if (!token) return res.status(404).json({ message: "invalid link" })


        await User.findByIdAndUpdate(user._id, { verified: true })

        await token.remove()



        res.status(200).json({ message: "Your email has been verified" })
        console.log("Your email has been verified");



    } catch (error) {


        console.log(error);

        res.status(500).json({ error })



    }





}

export const resetPasswordRequest = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const user = await User.findOne({ email: req.body.email })
        if (!user) return res.status(404).json({ message: "User not found" })

        const token = await Token.findOne({ user: user._id })
        if (token) await token.remove()

        const newToken = await (await Token.create({
            user: user._id,
            token: crypto.randomBytes(16).toString("hex"),
        })).save()

        const url = `http://localhost:3000/user/${user._id}/reset-password/${newToken.token}`

        await sendEmail(user.email, "Reset your password", `Please click on the following link to reset your password: ${url}`)

        res.status(200).json({ message: "An email has been sent to your email address. Please click on the link to reset your password." })




    } catch (error) {
        res.status(500).json({ error })

        console.log(error);

    }

}

export const resetPasswordWithToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findOne({ _id: req.params.id });
        if (!user) return res.status(404).json({ message: "Invalid link" });

        const token = await Token.findOne({
            user: req.params.id,
            token: req.params.token
        });
        if (!token) return res.status(404).json({ message: "Invalid link" });

        // Check if password and confirmPassword match
        if (req.body.password !== req.body.rePassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        // Update user password and remove token

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.password, salt);



        await User.findByIdAndUpdate(user._id,
            {
                $set: {
                    password: hash,
                },

            },
            { new: true }
        );
        await token.remove();

        res.status(200).json({ message: "Your password has been updated" });
        console.log("Your password has been updated");

    } catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
}

export const checkToken = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const token = await Token.findOne({
            token: req.params.token,
        })

        if (!token) return res.status(404).json({ message: "Invalid link" });

        res.status(200).json({ message: "Valid link" });


    } catch (error) {

        res.status(500).json({ error });




    }

}

export default {
    register, login, stats,
    allUsers,
    deleteUser,
    verifyEmail,
    resetPasswordRequest,
    resetPasswordWithToken,
    checkToken
};
