import express from 'express';
// import uploadVideo from '../controllers/UploadVideo';
import controller from '../controllers/Video';

const router = express.Router();

router.post('/create', controller.createVideo);
router.get('/get/:videoId', controller.readVideo);
router.get('/get/', controller.getVideos);
router.put('/update/:videoId',  controller.updateVideo);
router.delete('/delete/:videoId', controller.deleteVideo);
// router.put("/addVideo/:id",uploadVideo)

export default router;