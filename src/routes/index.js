import express from 'express';
import asyncHandler from 'express-async-handler';
import { indexPage } from '../controllers';

import { quini6Sorteos, quini6Resultados } from '../controllers/quini6resultados';
import { tuJugadaSorteos, tuJugadaResultados } from '../controllers/tujugada';

const app = express.Router();

app.get('/', asyncHandler(indexPage));

// https://www.quini-6-resultados.com.ar/
app.get('/opc1/sorteos', asyncHandler(quini6Sorteos));
app.get('/opc1/resultados/:sorteoNro', asyncHandler(quini6Resultados));

// https://www.tujugada.com.ar/quini6.asp
app.get('/opc2/sorteos', asyncHandler(tuJugadaSorteos));
app.get('/opc2/resultados/:sorteoNro', asyncHandler(tuJugadaResultados));

export default app;
