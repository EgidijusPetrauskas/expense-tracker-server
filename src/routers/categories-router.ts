import { Router } from 'express';

import { authMiddleware, userMiddleware } from '../middlewares/auth-middlewares';
import {
 createCategory, deleteCategory, getCategory, getCategories,
} from '../controllers/categories-controller';

const categoriesRouter = Router();
categoriesRouter.use(authMiddleware, userMiddleware);

categoriesRouter.get('/', getCategories);
categoriesRouter.get('/:id', getCategory);
categoriesRouter.post('/', createCategory);
categoriesRouter.delete('/:id', deleteCategory);

export default categoriesRouter;
