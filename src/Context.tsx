import React, { createContext } from 'react'
import PropTypes from 'prop-types'
import CroodsPropTypes from './CroodsPropTypes'
import { ProviderElement } from './typeDeclarations'

const CroodsContext = createContext({})

export const CProvider = ({ children, ...options }: ProviderElement) => {
  return (
    <CroodsContext.Provider value={options}>{children}</CroodsContext.Provider>
  )
}

CProvider.propTypes = {
  // the base API url for all requests
  // @ts-ignore
  baseUrl: CroodsPropTypes.url.isRequired,
  children: PropTypes.element.isRequired,
  credentials: PropTypes.object,
  cache: PropTypes.bool,
  debugActions: PropTypes.bool,
  debugRequests: PropTypes.bool,
  // ({ Accept, 'Content-Type' }) -> Object
  headers: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  afterResponse: PropTypes.func,
  afterSuccess: PropTypes.func,
  afterFailure: PropTypes.func,
  after4xx: PropTypes.func,
  after5xx: PropTypes.func,
  /** Parse parameters keys before sending to API */
  paramsParser: PropTypes.func, // [Object] -> [Object]
  /** Parse data parameters keys returning from API: like to camelCase */
  paramsUnparser: PropTypes.func, // [Object] -> [Object]
  /** Parse responses to adjust the API to croods patterns */
  parseResponse: PropTypes.func, // (json, response, requestAttributes) -> Object
  /** Parse responses to adjust the API to croods patterns */
  parseFetchResponse: PropTypes.func, // (json, response, requestAttributes) -> Object
  /** Parse specific responses to adjust the API to croods patterns */
  parseListResponse: PropTypes.func, // (json, response, requestAttributes) -> Object
  parseInfoResponse: PropTypes.func, // (json, response, requestAttributes) -> Object
  parseSaveResponse: PropTypes.func, // (json, response, requestAttributes) -> Object
  parseCreateResponse: PropTypes.func, // (json, response, requestAttributes) -> Object
  parseUpdateResponse: PropTypes.func, // (json, response, requestAttributes) -> Object
  parseErrors: PropTypes.func, // error -> String
  /** Parse queryString keys for composing the endpoint */
  queryStringParser: PropTypes.func, // String -> String
  renderError: PropTypes.func,
  renderEmpty: PropTypes.func,
  renderLoading: PropTypes.func,
  requestTimeout: PropTypes.number,
  urlParser: PropTypes.func, // String -> String
}

export default CroodsContext
