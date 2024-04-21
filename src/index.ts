import "express-async-errors"

import express from 'express';
import routes from './routes';
import 'dotenv/config'
import { startDB } from './config/prisma';
import { errorMiddleware } from './middlewares/error';

const port = process.env.PORT || 3000;

startDB();

const app = express();

app.use(express.json());
app.use(routes);

app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
