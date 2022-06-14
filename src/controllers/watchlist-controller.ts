import { RequestHandler } from 'express';
import UserModel from '../models/user-model';

type WatchlistItemResponse = { watchlistItem: string } | ErrorResponseBody;

export const getWatchlist: RequestHandler<
  unknown,
  { watchlistItems: string[] } | ErrorResponseBody
> = async (req, res) => {
  const { authUserDoc } = req;

  try {
    if (authUserDoc === undefined) {
      throw new Error('You have to log in!');
    }

    const authCurrentUserDoc = await UserModel.findById(authUserDoc._id);

    if (authCurrentUserDoc === null) {
      throw new Error('Something went wrong. User not found!');
    }

    res.status(200).send({ watchlistItems: authCurrentUserDoc.watchlist });
  } catch (error) {
    res.status(400).send({
      error: error instanceof Error ? error.message : 'Error downloading Watchlist',
    });
  }
};

export const addItem: RequestHandler<
  unknown,
  WatchlistItemResponse,
  { symbol: string }
> = async (req, res) => {
  const { symbol } = req.body;
  const { authUserDoc } = req;

  try {
    if (authUserDoc === undefined) {
      throw new Error('You have to log in!');
    }

    const itemExistsInWatchlist = authUserDoc.watchlist.includes(symbol);

    if (itemExistsInWatchlist) {
      throw new Error('Already in the Watchlist!');
    }
    authUserDoc.watchlist.push(symbol);

    await authUserDoc.save();

    const watchlistItem = authUserDoc.watchlist[authUserDoc.watchlist.length - 1];

    res.status(200).json({
      watchlistItem,
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : 'Data is incorrect',
    });
  }
};

export const deleteItem: RequestHandler<
  { symbol: string },
  WatchlistItemResponse
> = async (req, res) => {
  const { symbol } = req.params;
  const { authUserDoc } = req;
  try {
    if (authUserDoc === undefined) {
      throw new Error('You have to log in!');
    }

    const deletedItemDocIndex = authUserDoc.watchlist.findIndex(
      (item) => item === symbol,
    );
    if (deletedItemDocIndex === -1) {
      throw new Error('Item is not found in Watchlist!');
    }

    const deletedItemDoc = authUserDoc.watchlist[deletedItemDocIndex];
    authUserDoc.watchlist.splice(deletedItemDocIndex, 1);

    await authUserDoc.save();

    res.status(200).json({ watchlistItem: deletedItemDoc });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : 'Data is incorrect',
    });
  }
};
