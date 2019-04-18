import { useContext, useEffect } from 'react'
import axios from 'axios'
import createHumps from 'lodash-humps/lib/createHumps'
import camelCase from 'lodash/camelCase'
import kebabCase from 'lodash/kebabCase'
import snakeCase from 'lodash/snakeCase'
import useGlobal from './store'
import findStatePiece from './findStatePiece'
import Context from './Context'
import { responseLogger, requestLogger } from './logger'

const defaultParseResponse = ({ data }) => data
const defaultParseParams = snakeCase
const defaultUnparseParams = camelCase
const defaultUrlParser = kebabCase

const defaultHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
}

const useCroods = ({ name, stateId, ...opts }, autoFetch) => {
  const baseOptions = useContext(Context)
  const [state, actions] = useGlobal()
  const piece = findStatePiece(state, name, stateId)

  const options = { ...baseOptions, ...opts, name, stateId }
  const { baseUrl, debugRequests, cache, parseResponse } = options
  const { headers, credentials, requestTimeout } = options
  const { parseParams, unparseParams, urlParser } = options
  const paramsParser = createHumps(parseParams || defaultParseParams)
  const paramsUnparser = createHumps(unparseParams || defaultUnparseParams)

  const defaultPath = `/${(urlParser || defaultUrlParser)(name)}`

  const buildApi = async () => {
    const customHeaders = await (typeof headers === 'function'
      ? headers(defaultHeaders)
      : headers)
    return axios.create({
      baseURL: baseUrl,
      timeout: requestTimeout,
      withCredentials: !!credentials,
      credentials,
      headers: { ...defaultHeaders, ...customHeaders },
    })
  }

  const buildUrl = id => {
    const path = options.path || (id ? `${defaultPath}/${id}` : defaultPath)
    return path.replace(/([^https?:]\/)\/+/g, '$1')
  }

  const fetch = async id => {
    const api = await buildApi()
    const operation = id ? 'info' : 'list'
    const path = buildUrl(id)
    if (!id && !!piece.list.length && cache) return true
    const hasInfo =
      id && piece.list.length && actions.setInfo({ ...options, id })
    if (hasInfo && cache) return true
    debugRequests && requestLogger(path, 'GET')
    actions.getRequest({ ...options, operation })
    return api
      .get(path)
      .then(response => {
        const {
          parseInfoResponse,
          parseListResponse,
          parseFetchResponse,
        } = options
        debugRequests && responseLogger(path, 'GET', response)
        const parser =
          (id ? parseInfoResponse : parseListResponse) ||
          parseFetchResponse ||
          parseResponse ||
          defaultParseResponse
        const result = paramsUnparser(parser(response))
        return actions.getSuccess({ ...options, operation }, result)
      })
      .catch(error => {
        debugRequests && responseLogger(path, 'GET', error)
        return actions.getFail({ ...options, operation }, error)
      })
  }

  const save = id => async ({ $_addToTop, ...rawBody }) => {
    const api = await buildApi()
    const path = buildUrl(id)
    const method = id ? 'PUT' : 'POST'
    const body = paramsParser(rawBody)
    debugRequests && requestLogger(path, method, body)
    actions.saveRequest(options, id)
    const axiosMethod = id ? api.put : api.post
    return axiosMethod(path, body)
      .then(response => {
        debugRequests && responseLogger(path, method, response)
        const {
          parseCreateResponse,
          parseUpdateResponse,
          parseSaveResponse,
        } = options
        const parser =
          (id ? parseUpdateResponse : parseCreateResponse) ||
          parseSaveResponse ||
          parseResponse ||
          defaultParseResponse
        const result = paramsUnparser(parser(response))
        return actions.saveSuccess(options, { id, data: result }, $_addToTop)
      })
      .catch(error => {
        debugRequests && responseLogger(path, method, error)
        return actions.saveFail(options, { error, id })
      })
  }

  const destroy = id => async () => {
    if (!id) return false
    const api = await buildApi()
    const path = buildUrl(id)
    debugRequests && requestLogger(path, 'DELETE')
    actions.destroyRequest(options, id)
    return api
      .delete(path)
      .then(response => {
        debugRequests && responseLogger(path, 'DELETE', response)
        return actions.destroySuccess(options, id)
      })
      .catch(error => {
        debugRequests && responseLogger(path, 'DELETE', error)
        return actions.destroyFail(options, { error, id })
      })
  }

  const { id: givenId } = options

  useEffect(() => {
    autoFetch && fetch(givenId)
    // eslint-disable-next-line
  }, [givenId, autoFetch])

  return [piece, { fetch, save, destroy }]
}

export default useCroods
