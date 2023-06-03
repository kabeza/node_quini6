import express from 'express';
import quini6resultados from '../controllers/quini6resultados';
// import { quini6Sorteos, quini6Resultados, quini6TodosLosNumeros } from '../controllers/quini6resultados';

const app = express.Router();

app.get('/', (req, res) => {
  res.json({
    message: 'Bienvenido - API - Resultados Quini 6',
  });
});

app.get('/ping', (req, res) => {
  res.json({
    message: 'API - Resultados Quini 6',
    test: process.env.NODE_ENV,
  });
});

// https://www.quini-6-resultados.com.ar/
app.use('/q6r', quini6resultados);

// https://www.quini-6-resultados.com.ar/
// app.get('/q6r/sorteos', asyncHandler(quini6Sorteos));
// app.get('/q6r/resultados/:sorteoNro', asyncHandler(quini6Resultados));
// app.get('/q6r/todoslosnumeros', asyncHandler(quini6TodosLosNumeros));

// https://www.tujugada.com.ar/quini6.asp
// app.get('/tuju/sorteos', asyncHandler(tuJugadaSorteos));
// app.get('/tuju/resultados/:sorteoNro', asyncHandler(tuJugadaResultados));

export default app;
