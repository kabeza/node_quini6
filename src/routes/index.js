import express from 'express';
import asyncHandler from 'express-async-handler';
import { indexPage } from '../controllers';

import { quini6Sorteos, quini6Resultados } from '../controllers/quini6resultados';

const app = express.Router();

app.get('/', asyncHandler(indexPage));

app.get('/opc1/resultados/:sorteoNro', asyncHandler(quini6Resultados));
app.get('/opc1/sorteos', asyncHandler(quini6Sorteos));

export default app;
