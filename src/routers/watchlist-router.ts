import { Router } from 'express';
import {
  addItem,
  deleteItem,
  getWatchlist,
} from '../controllers/watchlist-controller';
import { authMiddleware, userMiddleware } from '../middlewares/auth-middlewares';

const watchlistRouter = Router();

watchlistRouter.use(authMiddleware, userMiddleware);

watchlistRouter.get('/', getWatchlist);
watchlistRouter.post('/add-item', addItem);
watchlistRouter.delete('/delete-item/:symbol', deleteItem);

export default watchlistRouter;
