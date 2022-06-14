import { RequestHandler } from 'express';
import ExpenseModel, { Expense } from '../models/expense-model';
import createExpenseViewModel, { ExpenseViewModel } from '../view-model-creators/create-expense-view-model';

type SingularExpenseResponse = { expense: ExpenseViewModel } | ErrorResponseBody;

export const getExpenses: RequestHandler<
  unknown,
  { user_expenses: ExpenseViewModel[] }
> = async (req, res) => {
  const { authUserDoc } = req;

  if (authUserDoc === undefined) {
    throw new Error('You have to log in!');
  }

  const userExpenses = await ExpenseModel.find({
    _id: { $in: authUserDoc.user_expenses },
  });

  res.status(200).json({
    user_expenses: userExpenses.map((expense) => createExpenseViewModel(expense)),
  });
};

export const createExpense: RequestHandler<
  unknown,
  SingularExpenseResponse,
  Expense
> = async (req, res) => {
  const expenseProps = req.body;
  const { authUserDoc } = req;
  try {
    const expenseDoc = await ExpenseModel.create(expenseProps);

    if (authUserDoc === undefined) {
      throw new Error('You have to log in!');
    }

    authUserDoc.user_expenses.push(expenseDoc.id);
    await authUserDoc.save();

    res.status(201).json({
      expense: createExpenseViewModel(expenseDoc),
    });
  } catch (err) {
    res.status(400).json({ error: 'Server error while creating \'Expense\'' });
  }
};

export const deleteExpense: RequestHandler<
  { id: string },
  SingularExpenseResponse
> = async (req, res) => {
  const { id } = req.params;
  const { authUserDoc } = req;

  try {
    const expenseDoc = await ExpenseModel.findByIdAndDelete(id);
    if (expenseDoc === null) {
      throw new Error(`Expense with id: '${id}' is not found`);
    }

    if (authUserDoc === undefined) {
      throw new Error('You have to log in!');
    }

    const deletedItemDocIndex = authUserDoc.user_expenses.findIndex(
      (item) => item._id.toString() === id,
    );

    if (deletedItemDocIndex === -1) {
      throw new Error('Expense is not found in Expenses!');
    }

    authUserDoc.user_expenses.splice(deletedItemDocIndex, 1);

    await authUserDoc.save();

    res.status(200).json({
      expense: createExpenseViewModel(expenseDoc),
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : 'Server error while deleting "Expense"',
    });
  }
};

export const clearExpenses: RequestHandler<
  unknown,
  { message: string }
> = async (req, res) => {
  const { authUserDoc } = req;

  if (authUserDoc === undefined) {
    throw new Error('You have to log in!');
  }

  await ExpenseModel.remove({});

  authUserDoc.user_expenses = [];
  authUserDoc.save();

  res.status(200).json({
    message: 'Expenses succesfuly cleared!',
  });
};
