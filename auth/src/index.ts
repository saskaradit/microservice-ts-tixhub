import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';

import { currentUserRouter } from './routes/current-user';
import { signInRouter } from './routes/signin';
import { signUpRouter } from './routes/signup';
import { signOutRouter } from './routes/signout';
import { errorHandler } from './routes/middlewares/error-handler';
import { RouteError } from './errors/route-error';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: true,
  })
);

app.use(currentUserRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(signUpRouter);

app.all('*', async (req, res) => {
  throw new RouteError();
});

app.use(errorHandler);

const init = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT must be defined');
  }

  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log('Connected');
  } catch (error) {
    console.error(error);
  }

  app.listen(3000, () => console.log('---AUTH---,Listening on port 3000'));
};

init();

// kubectl create secret generic jwt-secret --from-literal=JWT_KEY=radrad
