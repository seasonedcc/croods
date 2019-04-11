import initialState from './initialState'
import axios from 'axios'
import snakeCase from 'lodash/snakeCase'
import useGlobal from './store'

const apiBase = 'https://reqres.in/api'
const parseResponse = ({ data }) => data

const useCroods = ({ name, parentId, ...opts }) => {
  const [state, actions] = useGlobal()
  const defaultPath = `/${snakeCase(name)}`

  const options = { name, parentId }

  const create = async ({ $_addToTop, ...data }) => {
    actions.createRequest(options)
    return axios
      .post(`${apiBase}${opts.path || defaultPath}`, data)
      .then(({ data }) => {
        actions.createSuccess(options, data, $_addToTop)
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
    const path = id ? `${basePath}/${id}` : basePath
    actions.getRequest({ ...options, operation })
    return axios
      .get(`${apiBase}${path}`)
      .then(({ data }) => {
        const response = parseResponse(data)
        actions.getSuccess({ ...options, operation }, response)
        return true
      })
      .catch(error => {
        actions.getFail({ ...options, operation }, error)
        return false
      })
  }

  const update = id => async data => {
    actions.updateRequest(options, id)
    return axios
      .patch(`${apiBase}${opts.path || `${defaultPath}/${id}`}`, data)
      .then(({ data }) => {
        actions.updateSuccess(options, { id, data })
        return true
      })
      .catch(error => {
        actions.updateFail(options, { error, id })
        return false
      })
  }

  const destroy = id => async () => {
    actions.destroyRequest(options, id)
    return axios
      .delete(`${apiBase}${opts.path || `${defaultPath}/${id}`}`)
      .then(() => {
        actions.destroySuccess(options, id)
        return true
      })
      .catch(error => {
        actions.destroyFail(options, { error, id })
        return false
      })
  }

  const piece = state[name] || initialState
  return [piece, { fetch, create, update, destroy }]
}

export default useCroods
