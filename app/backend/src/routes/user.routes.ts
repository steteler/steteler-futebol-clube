import * as express from 'express';
import userMiddleware from '../middlewares/user.middleware';
import authValidation from '../utils/authValidation';
import LoginController from '../controllers/user.controller';

const userRouter = express.Router();

const userController = new LoginController();

userRouter.get('/validate', authValidation, userController.getRole);
userRouter.post('/', userMiddleware, userController.login);

export default userRouter;
