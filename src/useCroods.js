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

  const create = async ({ $_addToTop, ...params }) => {
    const path = `${baseUrl}${options.path || defaultPath}`
    debugRequests && requestLogger(path, 'POST', params)
    actions.createRequest(options)
    return axios
      .post(path, params)
      .then(response => {
        debugRequests && responseLogger(path, 'POST', response)
        const { parseCreateResponse } = options
        const parser =
          parseCreateResponse || parseResponse || defaultParseResponse
        const result = parser(response)
        actions.createSuccess(options, result, $_addToTop)
        return true
      })
      .catch(error => {
        debugRequests && responseLogger(path, 'POST', error)
        actions.createFail(options, error)
        return false
      })
  }

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

  const update = id => async body => {
    const path = `${baseUrl}${options.path || `${defaultPath}/${id}`}`
    debugRequests && requestLogger(path, 'PATCH', body)
    actions.updateRequest(options, id)
    return axios
      .patch(path, body)
      .then(response => {
        debugRequests && responseLogger(path, 'PATCH', response)
        const { parseUpdateResponse } = options
        const parser =
          parseUpdateResponse || parseResponse || defaultParseResponse
        const result = parser(response)
        actions.updateSuccess(options, { id, data: result })
        return true
      })
      .catch(error => {
        debugRequests && responseLogger(path, 'PATCH', error)
        actions.updateFail(options, { error, id })
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

  return [piece, { create, fetch, update, destroy }]
}

export default useCroods
