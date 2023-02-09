import * as redis from 'redis'
import { Request, Response, NextFunction } from 'express';
import User from '../models/User';


const redisOptions: any = {
    host: 'dockerredis',
    port: 6379
};

const redisClient: redis.RedisClient = redis.createClient(redisOptions);

const DEFAULT_EXPIRATION = 30;

const getFromCache = async (req: Request, res: Response) => {
    redisClient.get('users', async (err, users) => {
        if (err) console.log(err);

        if (users) {
            return res.status(200).json(JSON.parse(users));
        } else {
            const data = await User.find().select('-password -__v')
            redisClient.setex('users', DEFAULT_EXPIRATION, JSON.stringify(data));
            return res.status(200).json(data);

        }
    }
    )
};

export default getFromCache;