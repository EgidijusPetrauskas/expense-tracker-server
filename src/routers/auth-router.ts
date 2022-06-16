import { Router } from 'express';

import {
 login,
 register,
 authenticate,
 checkUsername,
} from '../controllers/auth-controller';
import { authMiddleware } from '../middlewares/auth-middlewares';

const authRouter = Router();

authRouter.get('/check-username', checkUsername);
authRouter.post('/login', login);
authRouter.post('/register', register);
authRouter.post('/authenticate', authMiddleware, authenticate);

export default authRouter;
