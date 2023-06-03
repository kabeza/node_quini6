import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import * as middlewares from './middlewares';
import indexRouter from './routes/index';

require('dotenv').config();

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/v1', indexRouter);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
