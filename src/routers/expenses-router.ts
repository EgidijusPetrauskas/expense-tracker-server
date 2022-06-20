import { Router } from 'express';

import {
  getExpenses,
  createExpense,
  deleteExpense,
 clearExpenses,
} from '../controllers/expenses-controller';
import { authMiddleware, userMiddleware } from '../middlewares/auth-middlewares';

const expensesRouter = Router();
expensesRouter.use(authMiddleware, userMiddleware);

expensesRouter.get('/', getExpenses);
expensesRouter.post('/', createExpense);
expensesRouter.patch('/:clear-all', clearExpenses);
expensesRouter.delete('/:id', deleteExpense);

export default expensesRouter;
