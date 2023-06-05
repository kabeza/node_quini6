"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.indexPage = void 0;
var _settings = require("../settings");
var indexPage = function indexPage(req, res) {
  return res.status(200).json({
    message: _settings.testEnvVar
  });
};
exports.indexPage = indexPage;