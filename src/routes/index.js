import express from 'express';
import asyncHandler from 'express-async-handler';
import { indexPage } from '../controllers';

import { quini6Sorteos, quini6Resultados, quini6TodosLosNumeros } from '../controllers/quini6resultados';
import { tuJugadaSorteos, tuJugadaResultados } from '../controllers/tujugada';

const app = express.Router();

app.get('/', asyncHandler(indexPage));

// https://www.quini-6-resultados.com.ar/
app.get('/q6r/sorteos', asyncHandler(quini6Sorteos));
app.get('/q6r/resultados/:sorteoNro', asyncHandler(quini6Resultados));
app.get('/q6r/todoslosnumeros', asyncHandler(quini6TodosLosNumeros));

// https://www.tujugada.com.ar/quini6.asp
app.get('/tuju/sorteos', asyncHandler(tuJugadaSorteos));
app.get('/tuju/resultados/:sorteoNro', asyncHandler(tuJugadaResultados));

export default app;
