import { ExpenseDocument } from '../models/expense-model';

export type ExpenseViewModel = {
  id: string,
  title: string,
  category: string,
  price: number,
  amount: number,
  description: string
  createdAt: string,
  updatedAt: string,
};

const createExpenseViewModel = (expenseDoc: ExpenseDocument): ExpenseViewModel => ({
  id: expenseDoc._id.toString(),
  title: expenseDoc.title,
  category: expenseDoc.category,
  price: expenseDoc.price,
  amount: expenseDoc.amount,
  description: expenseDoc.description,
  createdAt: expenseDoc.createdAt,
  updatedAt: expenseDoc.updatedAt,
});

export default createExpenseViewModel;
