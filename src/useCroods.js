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

const useCroods = ({ name, stateId, ...opts }, autoFetch) => {
  const baseOptions = useContext(Context)
  const [state, actions] = useGlobal()
  const piece = findStatePiece(state, name, stateId)

  const options = { ...baseOptions, ...opts, name, stateId }
  const { baseUrl, debugRequests, cache, parseResponse } = options
  const { parseParams, unparseParams, urlParser } = options
  const paramsParser = createHumps(parseParams || defaultParseParams)
  const paramsUnparser = createHumps(unparseParams || defaultUnparseParams)

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
    const autoPath = id ? `${defaultPath}/${id}` : defaultPath
    const path = options.path || autoPath
    console.log('id', id)
    console.log('defaultPath', defaultPath)
    console.log('options.path', options.path)
    console.log('autoPath', autoPath)
    console.log('path', path)

    if (!id && !!piece.list.length && cache) return true
    const hasInfo =
      id && piece.list.length && actions.setInfo({ ...options, id })
    if (hasInfo && cache) return true
    debugRequests && requestLogger(baseUrl, path, 'GET')
    actions.getRequest({ ...options, operation })
    return api
      .get(path)
      .then(response => {
        const {
          parseInfoResponse,
          parseListResponse,
          parseFetchResponse,
        } = options
        debugRequests && responseLogger(baseUrl, path, 'GET', response)
        const parser =
          (id ? parseInfoResponse : parseListResponse) ||
          parseFetchResponse ||
          parseResponse ||
          defaultParseResponse
        const result = paramsUnparser(parser(response))
        return actions.getSuccess({ ...options, operation }, result)
      })
      .catch(error => {
        debugRequests && responseLogger(baseUrl, path, 'GET', error)
        return actions.getFail({ ...options, operation }, error)
      })
  }

  const save = id => async ({ $_addToTop, ...rawBody }) => {
    const path = options.path || (id ? `${defaultPath}/${id}` : defaultPath)
    const method = id ? 'PATCH' : 'POST'
    const body = paramsParser(rawBody)
    debugRequests && requestLogger(baseUrl, path, method, body)
    actions.saveRequest(options, id)
    const axiosMethod = id ? axios.patch : axios.post
    return axiosMethod(path, body)
      .then(response => {
        debugRequests && responseLogger(baseUrl, path, method, response)
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
        debugRequests && responseLogger(baseUrl, path, method, error)
        return actions.saveFail(options, { error, id })
      })
  }

  const destroy = id => async () => {
    const path = options.path || `${defaultPath}/${id}`
    debugRequests && requestLogger(baseUrl, path, 'DELETE')
    actions.destroyRequest(options, id)
    return api
      .delete(path)
      .then(response => {
        debugRequests && responseLogger(baseUrl, path, 'DELETE', response)
        return actions.destroySuccess(options, id)
      })
      .catch(error => {
        debugRequests && responseLogger(baseUrl, path, 'DELETE', error)
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
