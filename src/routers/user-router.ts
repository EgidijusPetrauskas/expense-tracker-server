import { Router } from 'express';

import { userMiddleware, authMiddleware } from '../middlewares/auth-middlewares';
import { update, remove } from '../controllers/user-controller';

const userRouter = Router();

userRouter.use(authMiddleware, userMiddleware);

userRouter.patch('/update', update);
userRouter.delete('/remove/:id', remove);

export default userRouter;
