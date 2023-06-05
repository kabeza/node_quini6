"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = _interopRequireDefault(require("express"));
var _expressAsyncHandler = _interopRequireDefault(require("express-async-handler"));
var _controllers = require("../controllers");
var _quini6resultados = require("../controllers/quini6resultados");
var _tujugada = require("../controllers/tujugada");
var app = _express["default"].Router();
app.get('/', (0, _expressAsyncHandler["default"])(_controllers.indexPage));

// https://www.quini-6-resultados.com.ar/
app.get('/q6r/sorteos', (0, _expressAsyncHandler["default"])(_quini6resultados.quini6Sorteos));
app.get('/q6r/resultados/:sorteoNro', (0, _expressAsyncHandler["default"])(_quini6resultados.quini6Resultados));

// https://www.tujugada.com.ar/quini6.asp
app.get('/tuju/sorteos', (0, _expressAsyncHandler["default"])(_tujugada.tuJugadaSorteos));
app.get('/tuju/resultados/:sorteoNro', (0, _expressAsyncHandler["default"])(_tujugada.tuJugadaResultados));
var _default = app;
exports["default"] = _default;