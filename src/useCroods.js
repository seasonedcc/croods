import { useContext } from 'react'
import axios from 'axios'
import snakeCase from 'lodash/snakeCase'
import initialState from './initialState'
import useGlobal from './store'
import Context from './Context'
import { responseLogger, requestLogger } from './logger'

const defaultParseResponse = ({ data }) => data

const useCroods = ({ name, parentId, ...opts }) => {
  const baseOptions = useContext(Context)
  const [state, actions] = useGlobal()
  const piece = state[name] || initialState

  const defaultPath = `/${snakeCase(name)}`

  const options = { ...baseOptions, ...opts, name, parentId }
  const { baseUrl, debugRequests, disableCache, parseResponse } = options

  const fetch = id => async () => {
    const operation = id ? 'info' : 'list'
    const path = `${baseUrl}${options.path ||
      (id ? `${defaultPath}/${id}` : defaultPath)}`
    if (!id && !!piece.list.length && !disableCache) return true
    const hasInfo =
      id && piece.list.length && actions.setInfo({ ...options, id })
    if (hasInfo && !disableCache) return true
    debugRequests && requestLogger(path, 'GET')
    actions.getRequest({ ...options, operation })
    return axios
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
        const result = parser(response)
        actions.getSuccess({ ...options, operation }, result)
        return true
      })
      .catch(error => {
        debugRequests && responseLogger(path, 'GET', error)
        actions.getFail({ ...options, operation }, error)
        return false
      })
  }

  const save = id => async ({ $_addToTop, ...body }) => {
    const path = `${baseUrl}${options.path ||
      (id ? `${defaultPath}/${id}` : defaultPath)}`
    const method = id ? 'PATCH' : 'POST'
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
        const result = parser(response)
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
    const path = `${baseUrl}${options.path || `${defaultPath}/${id}`}`
    debugRequests && requestLogger(path, 'DELETE')
    actions.destroyRequest(options, id)
    return axios
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

  return [piece, { fetch, save, destroy }]
}

export default useCroods
