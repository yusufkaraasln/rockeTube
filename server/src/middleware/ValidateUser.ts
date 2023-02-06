import { NextFunction, Response, Request } from "express";
import { JWT_SECRET } from "../config/config";
import jwt from "jsonwebtoken";
import Logging from "../library/Logging";

const verify = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const token = req.cookies.access_token;
    !token && next(Logging.error("You are not authenticated"));

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
        err && next(Logging.error("You are not authenticated"));

        (<any>req).user = user;
        next();
    });
};


export default verify;
