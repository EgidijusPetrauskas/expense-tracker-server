import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import cors from 'cors';
import expensesRouter from './routers/expenses-router';
import authRouther from './routers/auth-router';
import watchlistRouter from './routers/watchlist-router';
import config from './config';
import categoriesRouter from './routers/categories-router';
import userRouter from './routers/user-router';

const server = express();

// Middlewares
server.use(cors());
server.use(morgan(':method :url :status'));
server.use(express.static('public'));
server.use(express.json());
server.use('/api/expenses', expensesRouter);
server.use('/api/categories', categoriesRouter);
server.use('/api/auth', authRouther);
server.use('/api/watchlist', watchlistRouter);
server.use('/api/user', userRouter);

mongoose.connect(
  config.db.connectionUrl,
  {
    retryWrites: true,
    w: 'majority',
  },
  (error) => {
    if (error) {
      console.log(`Failed connection to:\n${error.message}`);
      return;
    }
    console.log('Successfully connected to MongoDB');
    server.listen(1337, () => console.log('Appliaction server is running on: http://localhost:1337'));
  },
);
