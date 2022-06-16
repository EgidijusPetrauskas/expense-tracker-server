import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import UserModel from '../models/user-model';

type DecodedInfo = { username: string, iat?: number };

export const authMiddleware: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;
  try {
    if (authHeader === undefined) throw new Error('You have to log in!');

    const token = authHeader.split(' ')[1];
    if (token === undefined) throw new Error('Wrong authentication data!');

    const decodedInfo = jwt.verify(token, config.token.secret) as DecodedInfo;

    req.tokenData = {
      username: decodedInfo.username,
      token: `Bearer ${token}`,
    };

    next();
  } catch (error) {
    res.status(401).json({
      error: error instanceof Error ? error.message : 'Error during authentication',
    });
  }
};

export const userMiddleware: RequestHandler = async (req, res, next) => {
  if (req.tokenData === undefined) {
    res.status(401).json({
      error: 'You have to log in!',
    });
    return;
  }
  const authUserDoc = await UserModel.findOne({ username: req.tokenData.username });

  if (authUserDoc === null) {
    res.status(404).json({
      error: 'Current user is not found',
    });
    return;
  }

  req.authUserDoc = authUserDoc;

  next();
};
