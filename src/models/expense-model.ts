import {
  Schema,
  Model,
  Document,
  Types,
  model,
} from 'mongoose';

export type Expense = {
  title: string,
  category: string,
  price: number,
  amount: number,
  description: string
  createdAt: string,
  updatedAt: string,
};

export type ExpenseDocument = Document<Types.ObjectId, unknown, Expense> & Expense & {
  _id: Types.ObjectId;
};

export const expenseSchema = new Schema<Expense, Model<Expense>>({
  title: {
    type: String,
    required: true,
  },
  category: [{ type: Schema.Types.ObjectId, ref: 'Category', required: true }],
  price: {
    type: Number,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  description: String,

}, {
  timestamps: true,
});

const ExpenseModel = model('Expense', expenseSchema);

export default ExpenseModel;
