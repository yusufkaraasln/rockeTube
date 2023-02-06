import express from 'express';
import controller from '../controllers/Comments';
import { Schemas, validateSchema } from '../middleware/ValidateSchema';

const router = express.Router();

router.post('/create', controller.makeComment);
router.get('/get/:commentId', controller.readComment);
// router.get('/get/', controller.getVideos);
// router.put('/update/:videoId',  controller.updateVideo);
// router.delete('/delete/:videoId', controller.deleteVideo);

export default router;