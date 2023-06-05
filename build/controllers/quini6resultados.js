"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof3 = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.quini6Resultados = quini6Resultados;
exports.quini6Sorteos = quini6Sorteos;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));
var cheerio = _interopRequireWildcard(require("cheerio"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof3(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var axios = require('axios')["default"];
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
          url2Get = 'https://www.quini-6-resultados.com.ar/quini6/sorteos-anteriores.aspx';
          _context.prev = 1;
          _context.next = 4;
          return axios.get(url2Get);
        case 4:
          response = _context.sent;
          $ = cheerio.load(response.data);
          resp = [];
          $('div.col-md-3 p a').each(function (i, el) {
            var tit = $(el).text().split('del ');
            resp[i] = {
              sorteo: {
                numero: tit[0].replace('Sorteo ', ''),
                titulo: tit[0],
                fecha: tit[1].replace(/-/g, '/').trim(),
                link: $(el).attr('href')
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
function quini6Sorteos(_x, _x2) {
  return _quini6Sorteos.apply(this, arguments);
}
function _quini6Sorteos() {
  _quini6Sorteos = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res) {
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
  return _quini6Sorteos.apply(this, arguments);
}
var obtenerResultados = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(sorteoNro) {
    var listaSorteos, resBusca, url2Get, retorno, response, $;
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
          $ = cheerio.load(response.data); // 1 SORTEO TRADICIONAL
          retorno.resultados[0] = {
            titulo: 'SORTEO TRADICIONAL',
            numeros: $('h3:contains("SORTEO TRADICIONAL")').next().text().trim().replace(/-/g, ',').replace(/\s/g, ''),
            premios: []
          };
          $('tr.verde:contains("SORTEO TRADICIONAL")').nextUntil('tr.verde').each(function (i, el) {
            var st = $(el).find('td').toArray();
            retorno.resultados[0].premios.push({
              aciertos: $(st[0]).text().trim(),
              ganadores: $(st[1]).text().trim(),
              premio: $(st[2]).text().trim()
            });
          });

          // 2 LA SEGUNDA DEL QUINI
          retorno.resultados[1] = {
            titulo: 'LA SEGUNDA DEL QUINI',
            numeros: $('h3:contains("LA SEGUNDA DEL QUINI")').next().text().trim().replace(/-/g, ',').replace(/\s/g, ''),
            premios: []
          };
          $('tr.verde:contains("LA SEGUNDA DEL QUINI 6")').first().nextUntil('tr.verde').each(function (i, el) {
            var sq = $(el).find('td').toArray();
            retorno.resultados[1].premios.push({
              aciertos: $(sq[0]).text().trim(),
              ganadores: $(sq[1]).text().trim(),
              premio: $(sq[2]).text().trim()
            });
          });

          // 3 SORTEO REVANCHA
          retorno.resultados[2] = {
            titulo: 'SORTEO REVANCHA',
            numeros: $('h3:contains("SORTEO REVANCHA")').next().text().trim().replace(/-/g, ',').replace(/\s/g, ''),
            premios: []
          };
          $('tr.verde:contains("LA SEGUNDA DEL QUINI 6 REVANCHA")').nextUntil('tr.verde').each(function (i, el) {
            var sqr = $(el).find('td').toArray();
            retorno.resultados[2].premios.push({
              aciertos: $(sqr[0]).text().trim(),
              ganadores: $(sqr[1]).text().trim(),
              premio: $(sqr[2]).text().trim()
            });
          });

          // 4 SIEMPRE SALE
          retorno.resultados[3] = {
            titulo: 'SIEMPRE SALE',
            numeros: $('h3:contains("QUE SIEMPRE SALE")').next().text().trim().replace(/-/g, ',').replace(/\s/g, ''),
            premios: []
          };
          $('tr.verde:contains("EL QUINI QUE SIEMPRE SALE")').nextUntil('tr.verde').each(function (i, el) {
            var qqsl = $(el).find('td').toArray();
            retorno.resultados[3].premios.push({
              aciertos: $(qqsl[0]).text().trim(),
              ganadores: $(qqsl[1]).text().trim(),
              premio: $(qqsl[2]).text().trim()
            });
          });

          // 5 POZO EXTRA
          retorno.resultados[4] = {
            titulo: 'POZO EXTRA',
            numeros: 'Se reparte entre los que tengan seis aciertos contando los tres primeros sorteos. Los números repetidos se cuentan solo una vez.',
            premios: []
          };
          $('tr.verde:contains("QUINI 6 POZO EXTRA")').nextUntil('tr.verde').each(function (i, el) {
            var qpe = $(el).find('td').toArray();
            retorno.resultados[4].premios.push({
              aciertos: $(qpe[0]).text().trim(),
              ganadores: $(qpe[1]).text().trim(),
              premio: $(qpe[2]).text().trim()
            });
          });
          return _context2.abrupt("return", retorno);
        case 24:
          _context2.prev = 24;
          _context2.t0 = _context2["catch"](6);
          // eslint-disable-next-line no-console
          console.log(_context2.t0);
          return _context2.abrupt("return", false);
        case 28:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[6, 24]]);
  }));
  return function obtenerResultados(_x3) {
    return _ref2.apply(this, arguments);
  };
}();
function quini6Resultados(_x4, _x5) {
  return _quini6Resultados.apply(this, arguments);
}
function _quini6Resultados() {
  _quini6Resultados = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res) {
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
          return obtenerResultados(req.params.sorteoNro);
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
  return _quini6Resultados.apply(this, arguments);
}