import { User, UserDocument } from '../models/user-model';

export type UserViewModel = Omit<User, 'password' | 'user_expenses'> & {
  id: string,
  user_expenses: string[],
};

const createUserViewModel = (userDoc: UserDocument): UserViewModel => ({
  id: userDoc._id.toString(),
  username: userDoc.username,
  watchlist: userDoc.watchlist,
  user_expenses: userDoc.user_expenses.map((expense) => expense.toString()),
  firstName: userDoc.firstName,
  lastName: userDoc.lastName,
  email: userDoc.email,
  age: userDoc.age,
  createdAt: userDoc.createdAt,
  updatedAt: userDoc.updatedAt,
});

export default createUserViewModel;
