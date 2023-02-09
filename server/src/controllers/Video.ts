import { NextFunction, Request, Response } from 'express';
import Video from '../models/Video';
import mongoose from 'mongoose';
import Actor from '../models/Actor';
import Company from '../models/Company';
import AWS from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';
import redis from 'redis';

const client = redis.createClient({
    host: 'dockerredis',
    port: 6379
});

const s3: any = new AWS.S3({
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
    region: process.env.S3_REGION
});

const createVideo = async (req: Request, res: Response, next: NextFunction) => {




    const video = new Video({
        title: req.body.title,
        description: req.body.description,
        video_url: req.body.video_url,
        cover_url: req.body.cover_url,
        actors: req.body.actors,
        company: req.body.company
    });

    try {
        // add video to actor
        const actors = await Actor.find({ _id: { $in: video?.actors } })
        actors?.forEach(async (actor) => {
            actor?.films.push(video?._id)
            await actor?.save()
        })


        // add video to company
        const company = await Company.findById(video?.company)
        company?.videos.push(video?._id)
        await company?.save()


        const result = await video.save();
        return res.status(201).json({
            message: 'Video created',
            createdVideo: result
        });
    } catch (err) {
        res.status(500).json({
            error: err
        });
    }
}

const readVideo = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.videoId;


    try {
        const video = await Video
            .findById(id)
            .populate('actors')
            .populate('company')
            .populate('comments')
            .populate('favorites')
            .select("-__v");




        if (video) {
            return res.status(200).json({
                video
            });
        }
        else {
            return res.status(404).json({
                message: 'Video not found'
            });
        }
    }
    catch (err) {
        res.status(500).json({
            error: err
        });
    }
}

const updateVideo = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.videoId;

    try {
        const result = await Video.findByIdAndUpdate(id, {
            $set: req.body
        }, { new: true })

        return res.status(200).json({
            message: 'Video updated',
            updatedVideo: result
        });
    }
    catch (err) {
        res.status(500).json({
            error: err
        });
    }
}


const deleteVideo = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.videoId;

    try {
        const result = await Video.findByIdAndDelete(id);

        return res.status(200).json({
            message: 'Video deleted',
            deletedVideo: result
        });
    }
    catch (err) {
        res.status(500).json({
            error: err
        });
    }
}


const getVideos = async (req: Request, res: Response, next: NextFunction) => {
    try {


        client.get('videos', async (err, videos) => {
            err && console.log(err)

            if (videos) {
                return res.status(200).json({
                    videos: JSON.parse(videos)
                });
            } else {
                const videos = await Video.find()
                    .populate('actors')
                    .populate('company')
                    .populate('comments')
                    .populate('favorites')
                    .select("-__v");
                    
                client.setex('videos', 1800, JSON.stringify(videos));
                return res.status(200).json({
                    videos
                });

            }
        }
        )

        
    }
    catch (err) {
        res.status(500).json({
            error: err
        });
    }
}

export default {
    createVideo,
    readVideo,
    updateVideo,
    deleteVideo,
    getVideos
}
