import { useContext } from 'react'
import axios from 'axios'
import snakeCase from 'lodash/snakeCase'
import initialState from './initialState'
import useGlobal from './store'
import Context from './Context'

const defaultParseResponse = ({ data }) => data

const useCroods = ({ name, parentId, ...opts }) => {
  const baseOptions = useContext(Context)
  const [state, actions] = useGlobal()
  const piece = state[name] || initialState

  const defaultPath = `/${snakeCase(name)}`

  const options = { ...baseOptions, ...opts, name, parentId }

  const create = async ({ $_addToTop, ...body }) => {
    const path = `${options.baseUrl}${opts.path || defaultPath}`
    actions.createRequest({
      ...options,
      path,
      params: { ...body, method: 'POST' },
    })
    return axios
      .post(path, body)
      .then(response => {
        const parser =
          options.parseCreateResponse ||
          options.parseResponse ||
          defaultParseResponse
        const result = parser(response)
        actions.createSuccess(options, result, $_addToTop)
        return true
      })
      .catch(error => {
        actions.createFail(options, error)
        return false
      })
  }

  const fetch = async id => {
    const operation = id ? 'info' : 'list'
    const basePath = opts.path || defaultPath
    const path = `${options.baseUrl}${id ? `${basePath}/${id}` : basePath}`
    if (!id && !!piece.list.length && !options.disableCache) return true
    const hasInfo =
      id && piece.list.length && actions.setInfo({ ...options, id })
    if (hasInfo && !options.disableCache) return true
    actions.getRequest({
      ...options,
      operation,
      path,
      params: { method: 'GET' },
    })
    return axios
      .get(path)
      .then(response => {
        const parser =
          (id ? options.parseInfoResponse : options.parseListResponse) ||
          options.parseFetchResponse ||
          options.parseResponse ||
          defaultParseResponse
        const result = parser(response)
        actions.getSuccess({ ...options, operation }, result)
        return true
      })
      .catch(error => {
        actions.getFail({ ...options, operation }, error)
        return false
      })
  }

  const update = id => async body => {
    const path = `${options.baseUrl}${opts.path || `${defaultPath}/${id}`}`
    actions.updateRequest(
      { ...options, path, params: { id, ...body, method: 'PATH' } },
      id,
    )
    return axios
      .patch(path, body)
      .then(response => {
        const parser =
          options.parseUpdateResponse ||
          options.parseResponse ||
          defaultParseResponse
        const result = parser(response)
        actions.updateSuccess(options, { id, data: result })
        return true
      })
      .catch(error => {
        actions.updateFail(options, { error, id })
        return false
      })
  }

  const destroy = id => async () => {
    const path = `${options.baseUrl}${opts.path || `${defaultPath}/${id}`}`
    actions.destroyRequest(
      { ...options, path, params: { id, method: 'DELETE' } },
      id,
    )
    return axios
      .delete(path)
      .then(() => {
        actions.destroySuccess(options, id)
        return true
      })
      .catch(error => {
        actions.destroyFail(options, { error, id })
        return false
      })
  }

  return [piece, { create, fetch, update, destroy }]
}

export default useCroods
