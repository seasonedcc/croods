import { useContext, useEffect } from 'react'
import axios from 'axios'
import createHumps from 'lodash-humps/lib/createHumps'
import camelCase from 'lodash/camelCase'
import snakeCase from 'lodash/snakeCase'
import initialState from './initialState'
import useGlobal from './store'
import findStatePiece from './findStatePiece'
import Context from './Context'
import { responseLogger, requestLogger } from './logger'

const defaultParseResponse = ({ data }) => data
const defaultParseParams = snakeCase
const defaultUnparseParams = camelCase
const defaultUrlParser = snakeCase
const createParser = parser => createHumps(parser)

const useCroods = ({ name, stateId, ...opts }, autoFetch) => {
  const baseOptions = useContext(Context)
  const [state, actions] = useGlobal()
  const piece = findStatePiece(state, name, stateId)

  const options = { ...baseOptions, ...opts, name, stateId }
  const { baseUrl, debugRequests, cache, parseResponse } = options
  const { parseParams, unparseParams, urlParser } = options
  const paramsParser = createParser(parseParams || defaultParseParams)
  const paramsUnparser = createParser(unparseParams || defaultUnparseParams)

  const defaultPath = `/${(urlParser || defaultUrlParser)(name)}`

  const api = axios.create({
    baseURL: baseUrl,
    // CONFIG FOR AUTH
    // withCredentials: true,
    // headers: { 'X-Custom-Header': 'foobar' },
    // auth: {
    //   username: 'janedoe',
    //   password: 's00pers3cret',
    // },
  })

  const fetch = async id => {
    const operation = id ? 'info' : 'list'
    const path = options.path || (id ? `${defaultPath}/${id}` : defaultPath)
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
        actions.getSuccess({ ...options, operation }, result)
        return true
      })
      .catch(error => {
        debugRequests && responseLogger(path, 'GET', error)
        actions.getFail({ ...options, operation }, error)
        return false
      })
  }

  const save = id => async ({ $_addToTop, ...rawBody }) => {
    const path = options.path || (id ? `${defaultPath}/${id}` : defaultPath)
    const method = id ? 'PATCH' : 'POST'
    const body = paramsParser(rawBody)
    debugRequests && requestLogger(path, method, body)
    actions.saveRequest(options, id)
    const axiosMethod = id ? axios.patch : axios.post
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
        actions.saveSuccess(options, { id, data: result }, $_addToTop)
        return true
      })
      .catch(error => {
        debugRequests && responseLogger(path, method, error)
        actions.saveFail(options, { error, id })
        return false
      })
  }

  const destroy = id => async () => {
    const path = options.path || `${defaultPath}/${id}`
    debugRequests && requestLogger(path, 'DELETE')
    actions.destroyRequest(options, id)
    return api
      .delete(path)
      .then(response => {
        debugRequests && responseLogger(path, 'DELETE', response)
        actions.destroySuccess(options, id)
        return true
      })
      .catch(error => {
        debugRequests && responseLogger(path, 'DELETE', error)
        actions.destroyFail(options, { error, id })
        return false
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
