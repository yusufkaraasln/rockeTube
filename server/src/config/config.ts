import dotenv from 'dotenv';

dotenv.config();

const MONGO_USERNAME = process.env.MONGO_USERNAME || "";
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || "";
export const JWT_SECRET = process.env.JWT_SECRET ?
    process.env.JWT_SECRET
    : "";
const MONGO_URL = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@cluster0.3bz7d.mongodb.net/rocketube?retryWrites=true&w=majority`;

const SERVER_PORT = process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 3000;

export const S3_ACCESS_KEY = process.env.S3_ACCESS_KEY ? process.env.S3_ACCESS_KEY : "";
export const S3_SECRET_KEY = process.env.S3_SECRET_KEY ? process.env.S3_SECRET_KEY : "";
export const S3_REGION = process.env.S3_REGION ? process.env.S3_REGION : "";

export const config = {

    mongo: {
        url: MONGO_URL,
        options: {
            retryWrites: true,
            w: "majority"

        },
    },
    server: {
        port: SERVER_PORT,
    },


}

