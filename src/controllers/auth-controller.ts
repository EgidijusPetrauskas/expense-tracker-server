import { Error } from 'mongoose';
import { RequestHandler } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import config from '../config';
import UserModel, { UserProps } from '../models/user-model';
import createUserViewModel, { UserViewModel } from '../view-model-creators/create-user-view-model';

type AuthResponseBody = {
  user: UserViewModel,
  token: string,
} | ErrorResponseBody;

export const login: RequestHandler<
  unknown,
  AuthResponseBody,
  Partial<UserProps>
> = async (req, res) => {
  const { username, password } = req.body;

  try {
    if (!username) throw new Error('Username is rquired');
    if (!password) throw new Error('Password is required');

    const userDoc = await UserModel.findOne({ username });
    if (userDoc === null) throw new Error(`User with username: '${username}' is not found`);

    const passwordIsCorrect = bcrypt.compareSync(password, userDoc.password);
    if (!passwordIsCorrect) throw new Error('Wrong password');
    const token = jwt.sign({ username }, config.token.secret);

    res.status(200).json({
      user: createUserViewModel(userDoc),
      token: `Bearer ${token}`,
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : 'Server error while logging in!',
    });
  }
};

export const register: RequestHandler<
  unknown,
  AuthResponseBody,
  Partial<UserProps>
> = async (req, res) => {
  const { username, password } = req.body;

  try {
    if (!username) throw new Error('Username is rquired');
    if (!password) throw new Error('Password is required');

    const hashedPassword = bcrypt.hashSync(password, 5);
    const userDoc = await UserModel.create({ username, password: hashedPassword });

    const token = jwt.sign({ username }, config.token.secret);

    res.status(201).json({
      user: createUserViewModel(userDoc),
      token: `Bearer ${token}`,
    });
  } catch (error) {
    let message = 'Server error while registering!';

    if (error instanceof Error.ValidationError) {
      if (error.errors.username) {
        message = 'Username already exists';
      }
    } else if (error instanceof Error) {
      message = error.message;
    }
    res.status(400).json({
      error: message,
    });
  }
};

export const authenticate: RequestHandler<
  unknown,
  AuthResponseBody
> = async (req, res) => {
  try {
    if (req.tokenData === undefined) {
      throw new Error('User data needed for authentication is not found');
    }
    const { username, token } = req.tokenData;
    const userDoc = await UserModel.findOne({ username });

    if (userDoc === null) {
      throw new Error(`User: '${username}' is not found`);
    }
    const user = createUserViewModel(userDoc);

    res.status(200).json({
      user,
      token,
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : 'Server error authenticating user',
    });
  }
};

export const checkUsername: RequestHandler<
  unknown,
  { valid: true } | ErrorResponseBody,
  unknown,
  { username?: string }
> = async (req, res) => {
  const { username } = req.query;

  try {
    if (username === undefined) {
      throw new Error('Username is required for check up');
    }

    const userDoc = await UserModel.findOne({ username });
    if (userDoc !== null) {
      throw new Error('Username taken');
    }

    res.status(200).json({
      valid: true,
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : 'Server error while checking username',
    });
  }
};
