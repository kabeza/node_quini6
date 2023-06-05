"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof3 = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tuJugadaResultados = tuJugadaResultados;
exports.tuJugadaSorteos = tuJugadaSorteos;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));
var cheerio = _interopRequireWildcard(require("cheerio"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof3(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var axios = require('axios')["default"];
function insert(str, index, value) {
  return str.substr(0, index) + value + str.substr(index);
}
var searchJSON = function searchJSON(obj, key, val) {
  var results = [];
  for (var k in obj) {
    if (obj.hasOwnProperty(k)) {
      if (k === key && obj[k] === val) {
        results.push(obj);
      } else if ((0, _typeof2["default"])(obj[k]) === "object") {
        results = results.concat(searchJSON(obj[k], key, val));
      }
    }
  }
  return results;
};
var obtenerListaSorteos = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var url2Get, response, $, resp;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          url2Get = 'https://www.tujugada.com.ar/quini6.asp';
          _context.prev = 1;
          _context.next = 4;
          return axios.get(url2Get);
        case 4:
          response = _context.sent;
          $ = cheerio.load(response.data);
          resp = [];
          $('div.ante').each(function (i, el) {
            resp[i] = {
              sorteo: {
                numero: $(el).text().trim().substring(15, 19),
                titulo: insert($(el).text().trim(), 19, ' '),
                fecha: $(el).text().trim().slice($(el).text().trim().indexOf(':') + 1).trim(),
                link: "https://www.tujugada.com.ar/quini6.asp?sorteo=".concat($(el).text().trim().substring(15, 19))
              }
            };
          });
          return _context.abrupt("return", resp);
        case 11:
          _context.prev = 11;
          _context.t0 = _context["catch"](1);
          // eslint-disable-next-line no-console
          console.log(_context.t0);
          return _context.abrupt("return", false);
        case 15:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[1, 11]]);
  }));
  return function obtenerListaSorteos() {
    return _ref.apply(this, arguments);
  };
}();
function tuJugadaSorteos(_x, _x2) {
  return _tuJugadaSorteos.apply(this, arguments);
}
function _tuJugadaSorteos() {
  _tuJugadaSorteos = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res) {
    var datos;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return obtenerListaSorteos();
        case 3:
          datos = _context3.sent;
          return _context3.abrupt("return", res.status(200).json({
            status: 200,
            message: 'Sorteos obtenidos exitosamente',
            cantidad: datos.length,
            data: datos
          }));
        case 7:
          _context3.prev = 7;
          _context3.t0 = _context3["catch"](0);
          return _context3.abrupt("return", res.status(400).json({
            status: 400,
            message: _context3.t0.message
          }));
        case 10:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[0, 7]]);
  }));
  return _tuJugadaSorteos.apply(this, arguments);
}
var obtenerResultadosSorteo = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(sorteoNro) {
    var listaSorteos, resBusca, url2Get, retorno, response, $, numeros;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return obtenerListaSorteos();
        case 2:
          listaSorteos = _context2.sent;
          resBusca = searchJSON(listaSorteos, 'numero', sorteoNro);
          url2Get = resBusca[0].link;
          retorno = {
            infoSorteo: resBusca,
            resultados: []
          };
          _context2.prev = 6;
          _context2.next = 9;
          return axios.get(url2Get);
        case 9:
          response = _context2.sent;
          $ = cheerio.load(response.data);
          numeros = []; // 1 SORTEO TRADICIONAL
          numeros.splice(0, numeros.length);
          $('table.tit:contains("TRADICIONAL")').first().next().next().find('table').find('td').each(function (i, el) {
            numeros.push("0000".concat($(el).text().trim()).slice(-2));
          });
          retorno.resultados[0] = {
            titulo: 'SORTEO TRADICIONAL',
            numeros: numeros.toString(),
            premios: []
          };
          $('table.tit:contains("PREMIOS TRADICIONAL")').first().next('table').find('tr').each(function (i, el) {
            if ($(el).text().trim().includes('Aciertos')) {
              return true;
            }
            var st = $(el).find('td').toArray();
            retorno.resultados[0].premios.push({
              aciertos: $(st[0]).text().trim().replace(' Nros.', ''),
              ganadores: $(st[1]).text().trim(),
              premio: $(st[2]).text().trim()
            });
          });

          // 2 SEGUNDA VUELTA
          numeros.splice(0, numeros.length);
          $('table.tit:contains("SEGUNDA VUELTA")').first().next().next().find('table').find('td').each(function (i, el) {
            numeros.push("0000".concat($(el).text().trim()).slice(-2));
          });
          retorno.resultados[1] = {
            titulo: 'SEGUNDA VUELTA',
            numeros: numeros.toString(),
            premios: []
          };
          $('table.tit:contains("PREMIOS 2DA VUELTA")').first().next('table').find('tr').each(function (i, el) {
            if ($(el).text().trim().includes('Aciertos')) {
              return true;
            }
            var st = $(el).find('td').toArray();
            retorno.resultados[1].premios.push({
              aciertos: $(st[0]).text().trim().replace(' Nros.', ''),
              ganadores: $(st[1]).text().trim(),
              premio: $(st[2]).text().trim()
            });
          });

          // 3 REVANCHA
          numeros.splice(0, numeros.length);
          $('table.tit:contains("REVANCHA")').first().next().next().find('table').find('td').each(function (i, el) {
            numeros.push("0000".concat($(el).text().trim()).slice(-2));
          });
          retorno.resultados[2] = {
            titulo: 'REVANCHA',
            numeros: numeros.toString(),
            premios: []
          };
          $('table.tit:contains("PREMIOS REVANCHA")').first().next('table').find('tr').each(function (i, el) {
            if ($(el).text().trim().includes('Aciertos')) {
              return true;
            }
            var st = $(el).find('td').toArray();
            retorno.resultados[2].premios.push({
              aciertos: $(st[0]).text().trim().replace(' Nros.', ''),
              ganadores: $(st[1]).text().trim(),
              premio: $(st[2]).text().trim()
            });
          });

          // 3 SIEMPRE SALE
          numeros.splice(0, numeros.length);
          $('table.tit:contains("SIEMPRE SALE")').first().next().next().find('table').find('td').each(function (i, el) {
            numeros.push("0000".concat($(el).text().trim()).slice(-2));
          });
          retorno.resultados[3] = {
            titulo: 'SIEMPRE SALE',
            numeros: numeros.toString(),
            premios: []
          };
          $('table.tit:contains("PREMIOS SIEMPRE SALE")').first().next('table').find('tr').each(function (i, el) {
            if ($(el).text().trim().includes('Aciertos')) {
              return true;
            }
            var st = $(el).find('td').toArray();
            retorno.resultados[3].premios.push({
              aciertos: $(st[0]).text().trim().replace(' Nros.', ''),
              ganadores: $(st[1]).text().trim(),
              premio: $(st[2]).text().trim()
            });
          });

          // 4 POZO EXTRA
          numeros.splice(0, numeros.length);
          $('table.tit:contains("POZO EXTRA")').first().next().next().find('table').find('td').each(function (i, el) {
            numeros.push("0000".concat($(el).text().trim()).slice(-2));
          });
          $('table.tit:contains("POZO EXTRA")').first().next().next().next().find('table').find('td').each(function (i, el) {
            numeros.push("0000".concat($(el).text().trim()).slice(-2));
          });
          $('table.tit:contains("POZO EXTRA")').first().next().next().next().next().find('table').find('td').each(function (i, el) {
            numeros.push("0000".concat($(el).text().trim()).slice(-2));
          });
          retorno.resultados[4] = {
            titulo: 'POZO EXTRA',
            numeros: numeros.toString(),
            premios: []
          };
          $('table.tit:contains("PREMIOS POZO EXTRA")').first().next('table').find('tr').each(function (i, el) {
            if ($(el).text().trim().includes('Ganad.')) {
              return true;
            }
            var st = $(el).find('td').toArray();
            retorno.resultados[4].premios.push({
              aciertos: '6',
              ganadores: $(st[0]).text().trim(),
              premio: $(st[1]).text().trim()
            });
          });
          return _context2.abrupt("return", retorno);
        case 37:
          _context2.prev = 37;
          _context2.t0 = _context2["catch"](6);
          // eslint-disable-next-line no-console
          console.log(_context2.t0);
          return _context2.abrupt("return", false);
        case 41:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[6, 37]]);
  }));
  return function obtenerResultadosSorteo(_x3) {
    return _ref2.apply(this, arguments);
  };
}();
function tuJugadaResultados(_x4, _x5) {
  return _tuJugadaResultados.apply(this, arguments);
}
function _tuJugadaResultados() {
  _tuJugadaResultados = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res) {
    var datos;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          if (!(req.params.sorteoNro !== undefined)) {
            _context4.next = 13;
            break;
          }
          _context4.prev = 1;
          _context4.next = 4;
          return obtenerResultadosSorteo(req.params.sorteoNro);
        case 4:
          datos = _context4.sent;
          return _context4.abrupt("return", res.status(200).json({
            status: 200,
            message: 'Resultados del sorteo obtenidos exitosamente',
            data: datos
          }));
        case 8:
          _context4.prev = 8;
          _context4.t0 = _context4["catch"](1);
          return _context4.abrupt("return", res.status(400).json({
            status: 400,
            message: _context4.t0.message
          }));
        case 11:
          _context4.next = 14;
          break;
        case 13:
          return _context4.abrupt("return", res.status(500).json({
            status: 500,
            message: 'Debe enviar el parametro sorteoNro'
          }));
        case 14:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[1, 8]]);
  }));
  return _tuJugadaResultados.apply(this, arguments);
}