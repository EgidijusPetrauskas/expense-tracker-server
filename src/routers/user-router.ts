import { Router } from 'express';
import { userMiddleware, authMiddleware } from '../middlewares/auth-middlewares';
import { update } from '../controllers/user-controller';

const userRouter = Router();

userRouter.patch('/update', authMiddleware, userMiddleware, update);

export default userRouter;
