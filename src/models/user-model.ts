import {
  Schema,
  Model,
  Types,
  Document,
  model,
} from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

export type User = {
  username: string,
  password: string,
  watchlist: string[],
  user_expenses: Types.ObjectId[],
  firstName?: string,
  lastName?: string,
  email?: string,
  age?: string,
  createdAt: string,
  updatedAt: string,
};

export type UserProps = Omit<User, 'createdAt' | 'updatedAt' | 'watchlist' | 'user_expenses'> & {
  watchlist?: string[],
  user_expenses?: string[],
};

export type UserDetails = Omit<User, 'createdAt' | 'updatedAt' | 'watchlist' | 'user_expenses' | 'username' | 'password'>;

type UserDocumentProps = {
  watchlist: Types.DocumentArray<string[]>;
};

type UserModelType = Model<User, unknown, UserDocumentProps>;

export type UserDocument = Document<Types.ObjectId, unknown, User> & User & {
  _id: Types.ObjectId;
} & UserDocumentProps;

const userSchema = new Schema<User, UserModelType>({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  watchlist: {
    type: [String],
    default: [],
  },
  user_expenses: {
    type: [{ type: Schema.Types.ObjectId, ref: 'Expense' }],
    default: [],
  },
  firstName: String,
  lastName: String,
  email: String,
  age: String,
}, {
  timestamps: true,
});

userSchema.plugin(uniqueValidator);

const UserModel = model<User, UserModelType>('User', userSchema);

export default UserModel;
