import AuthController from '../controllers/AuthController.js';
import express from 'express';
import AppController from '../controllers/AppController.js';
import UserController from '../controllers/UsersController.js';

const router = express.Router();

router.get('/status', AppController.getAppStatus);
router.get('/stats', AppController.getAppStats);


// task 3
router.post('/users', UserController.postNew);

// task 4
router.get('/connect', AuthController.getConnect);
router.get('/disconnect', AuthController.getDisconnect);
router.get('/users/me', UserController.getMe);

export default router;

