(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', './heat-chart.js', './xy-chart.js', './jquery-extend.js'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('./heat-chart.js'), require('./xy-chart.js'), require('./jquery-extend.js'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.heatChart, global.xyChart, global.jqueryExtend);
    global.index = mod.exports;
  }
})(this, function (exports, _heatChart, _xyChart, _jqueryExtend) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'heatChart', {
    enumerable: true,
    get: function () {
      return _interopRequireDefault(_heatChart).default;
    }
  });
  Object.defineProperty(exports, 'xyChart', {
    enumerable: true,
    get: function () {
      return _interopRequireDefault(_xyChart).default;
    }
  });
  Object.defineProperty(exports, 'extend', {
    enumerable: true,
    get: function () {
      return _jqueryExtend.extend;
    }
  });

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }
});
