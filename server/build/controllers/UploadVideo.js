"use strict";
// import AWS from 'aws-sdk';
// import multer from 'multer';
// import multerS3 from 'multer-s3';
// import { NextFunction, Request, Response } from 'express';
// import Video from '../models/Video';
// const s3: any = new AWS.S3({
//     accessKeyId: process.env.S3_ACCESS_KEY,
//     secretAccessKey: process.env.S3_SECRET_KEY,
//     region: process.env.S3_REGION
// });
// const uploadVideo = async (req: any, res: Response, next: NextFunction) => {
//     const upload = multer({
//         storage: multerS3({
//             s3,
//             bucket: "rocketube-video",
//             key: function (req, file, cb) {
//                 cb(null, "a.png")
//             }
//         })
//     }).single('video');
//     upload(req, res, async function (err) {
//         if (err) {
//             console.log(
//                 err
//             );
//             return res.status(400).json({ errorrr: err });
//         }
//         await Video.findByIdAndUpdate(req.params.id, {
//             $set: {
//                 url: req.file.location
//             }
//         }, { new: true })
//         return res.status(200).json({
//             message: 'Video uploaded successfully.',
//             data: req.file
//         });
//     });
// }
// export default uploadVideo;
