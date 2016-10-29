'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.lastReferenceValue = exports.dataValue = exports.dataPath = exports.merge = exports.alterState = exports.sourceValue = exports.fields = exports.field = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.execute = execute;
exports.fetchData = fetchData;

var _languageCommon = require('language-common');

Object.defineProperty(exports, 'field', {
  enumerable: true,
  get: function get() {
    return _languageCommon.field;
  }
});
Object.defineProperty(exports, 'fields', {
  enumerable: true,
  get: function get() {
    return _languageCommon.fields;
  }
});
Object.defineProperty(exports, 'sourceValue', {
  enumerable: true,
  get: function get() {
    return _languageCommon.sourceValue;
  }
});
Object.defineProperty(exports, 'fields', {
  enumerable: true,
  get: function get() {
    return _languageCommon.fields;
  }
});
Object.defineProperty(exports, 'alterState', {
  enumerable: true,
  get: function get() {
    return _languageCommon.alterState;
  }
});
Object.defineProperty(exports, 'merge', {
  enumerable: true,
  get: function get() {
    return _languageCommon.merge;
  }
});
Object.defineProperty(exports, 'dataPath', {
  enumerable: true,
  get: function get() {
    return _languageCommon.dataPath;
  }
});
Object.defineProperty(exports, 'dataValue', {
  enumerable: true,
  get: function get() {
    return _languageCommon.dataValue;
  }
});
Object.defineProperty(exports, 'lastReferenceValue', {
  enumerable: true,
  get: function get() {
    return _languageCommon.lastReferenceValue;
  }
});

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _url = require('url');

var _languageHttp = require('language-http');

var _languageHttp2 = _interopRequireDefault(_languageHttp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var get = _languageHttp2.default.get;
var post = _languageHttp2.default.post;
/** @module Adaptor */

/**
 * Execute a sequence of operations.
 * Wraps `language-common/execute`, and prepends initial state for http.
 * @example
 * execute(
 *   create('foo'),
 *   delete('bar')
 * )(state)
 * @constructor
 * @param {Operations} operations - Operations to be performed.
 * @returns {Operation}
 */

function execute() {
  for (var _len = arguments.length, operations = Array(_len), _key = 0; _key < _len; _key++) {
    operations[_key] = arguments[_key];
  }

  var initialState = {
    references: [],
    data: null
  };

  return function (state) {
    state.configuration.authType = 'digest';
    state.configuration.baseUrl = "https://".concat(state.configuration.instanceName, ".firebase.com/api/v1");
    return _languageCommon.execute.apply(undefined, operations)(_extends({}, initialState, state));
  };
}

/**
 * Make a GET request and POST it somewhere else
 * @example
 * execute(
 *   fetch(params)
 * )(state)
 * @constructor
 * @param {object} params - data to make the fetch
 * @returns {Operation}
 */
function fetchData(params) {
  var _expandReferences = (0, _languageCommon.expandReferences)(params)(state);

  var getEndpoint = _expandReferences.getEndpoint;
  var query = _expandReferences.query;
  var postUrl = _expandReferences.postUrl;
  var _state$configuration = state.configuration;
  var username = _state$configuration.username;
  var password = _state$configuration.password;
  var baseUrl = _state$configuration.baseUrl;


  var url = (0, _url.resolve)(baseUrl + '/', getEndpoint);

  return (0, _request2.default)({
    url: url,
    qs: query,
    callback: function callback(state) {
      // Pick submissions out in order to avoid `post` overwriting `response`.
      var submissions = state.response.body;
      // return submissions
      return submissions.reduce(function (acc, item) {
        // tag submissions as part of the identified form
        item.formId = formId;
        return acc.then(post(postUrl, { body: item }));
      }, Promise.resolve(state)).then(function (state) {
        if (submissions.length) {
          state.lastSubmissionDate = submissions[submissions.length - 1].SubmissionDate;
        }
        return state;
      }).then(function (state) {
        delete state.response;
        console.log("fetchSubmissions succeeded.");
        return state;
      });
    }
  });
}
