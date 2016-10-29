import { execute as commonExecute, expandReferences } from 'language-common';
import request from 'request'
import { resolve as resolveUrl } from 'url';
import Adaptor from 'language-http';
const { get, post } = Adaptor;
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
export function execute(...operations) {
  const initialState = {
    references: [],
    data: null
  }

  return state => {
    state.configuration.authType = 'digest';
    state.configuration.baseUrl = "https://".concat(state.configuration.instanceName, ".firebase.com/api/v1")
    return commonExecute(...operations)({ ...initialState, ...state })
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
export function fetchData(params) {

  const { getEndpoint, query, postUrl } = expandReferences(params)(state);

  const { username, password, baseUrl } = state.configuration;

  const url = resolveUrl(baseUrl + '/', getEndpoint)

  return request({
    url: url,
    qs: query,
    callback: function(state) {
      // Pick submissions out in order to avoid `post` overwriting `response`.
      var submissions = state.response.body;
      // return submissions
      return submissions.reduce(function(acc, item) {
        // tag submissions as part of the identified form
        item.formId = formId;
        return acc.then(
          post( postUrl, { body: item })
        )
      }, Promise.resolve(state))
        .then(function(state) {
          if (submissions.length) {
            state.lastSubmissionDate = submissions[submissions.length-1].SubmissionDate
          }
          return state;
        })
        .then(function(state) {
          delete state.response
          console.log("fetchSubmissions succeeded.")
          return state;
        })
    }
  })
}

export {
  field, fields, sourceValue, fields, alterState,
  merge, dataPath, dataValue, lastReferenceValue
} from 'language-common';
