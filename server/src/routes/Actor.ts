import express from 'express';
import controller from '../controllers/Actor';

const router = express.Router();

router.post('/create', controller.createActor);
router.get('/get/:actorId', controller.readActor);
router.get('/get/', controller.readActors);
router.put('/update/:actorId',  controller.updateActor);
router.delete('/delete/:actorId', controller.deleteActor);

export default router;