import React, { createContext, useMemo } from 'react'
import PropTypes from 'prop-types'
import CroodsPropTypes from './CroodsPropTypes'

const CroodsContext = createContext()

const CroodsProvider = ({ children, ...options }) => {
  const value = useMemo(() => options, [options])
  return (
    <CroodsContext.Provider value={value}>{children}</CroodsContext.Provider>
  )
}

CroodsProvider.propTypes = {
  // the base API url for all requests
  baseUrl: CroodsPropTypes.url.isRequired,
  children: PropTypes.element.isRequired,
  credentials: PropTypes.string,
  cache: PropTypes.bool,
  debugActions: PropTypes.bool,
  debugRequests: PropTypes.bool,
  // ({ Accept, 'Content-Type' }) -> Object
  headers: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  afterResponse: PropTypes.func,
  afterSuccess: PropTypes.func,
  afterFailure: PropTypes.func,
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
  persistHeaders: PropTypes.bool,
  persistHeadersKey: PropTypes.string,
  persistHeadersMethod: PropTypes.func,
  renderError: PropTypes.func,
  renderEmpty: PropTypes.func,
  renderLoading: PropTypes.func,
  requestTimeout: PropTypes.number,
  urlParser: PropTypes.func, // String -> String
}

export const Provider = CroodsProvider

export default CroodsContext
