import { RequestHandler } from 'express';
import { Error } from 'mongoose';
import createUserViewModel, { UserViewModel } from '../view-model-creators/create-user-view-model';
import UserModel, { UserDetails } from '../models/user-model';

export const update: RequestHandler<
  unknown,
  { user: UserViewModel } | ErrorResponseBody,
  UserDetails
> = async (req, res) => {
  const { authUserDoc } = req;
  const userDetails = req.body;
  try {
    if (authUserDoc === undefined) {
      throw new Error('You have to log in!');
    }

    const userDoc = await UserModel
      .findOneAndUpdate({ username: authUserDoc.username }, { ...userDetails }, { new: true });

    if (userDoc === null) {
      throw new Error(`User: ${authUserDoc.username} cant be found!`);
    }

    res.status(201).json({
      user: createUserViewModel(userDoc),
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
