import express from 'express';
import verify from '../middleware/ValidateUser';
import controller from '../controllers/User';
// import getFromCache from '../controllers/redisCache';

const router = express.Router();

router.post('/register', controller.register);
router.post('/login', controller.login);
router.get('/stats', controller.stats);
router.get('/all', controller.allUsers);
router.delete('/delete/:id', controller.deleteUser);
router.get("/:id/verify/:token", controller.verifyEmail);
router.post("/reset-password", controller.resetPasswordRequest);
router.put("/:id/reset-password/:token", controller.resetPasswordWithToken);
router.get("/check-token/:token", controller.checkToken);

// router.get("/get/cache", getFromCache);


export default router;