import { useContext, useEffect, useMemo, useCallback } from 'react'
import createHumps from 'lodash-humps/lib/createHumps'
import omit from 'lodash/omit'
import snakeCase from 'lodash/snakeCase'

import Context from './Context'

import buildApi from './buildApi'
import buildQueryString from './buildQueryString'
import buildUrl from './buildUrl'
import doFail from './doFail'
import doSuccess from './doSuccess'
import findStatePiece, { findPath } from './findStatePiece'
import joinWith from './joinWith'
import shouldUseCache from './shouldUseCache'
import useGlobal from './store'
import { requestLogger } from './logger'

const useCroods = ({ name, stateId, fetchOnMount, ...opts }) => {
  if (typeof name !== 'string' || name.length < 1) {
    throw new Error('You must pass a name property to useCroods/Fetch')
  }
  const baseOptions = useContext(Context)
  const contextPath = findPath(name, stateId)
  const [state, actions] = useGlobal(contextPath)
  const piece = useMemo(() => findStatePiece(state, name, stateId), [
    name,
    state,
    stateId,
  ])

  const options = { ...baseOptions, ...opts, name, stateId }

  const fetch = useCallback(
    contextOpts => async query => {
      const config = { ...options, ...contextOpts }
      const { id, debugRequests } = config
      const queryString = buildQueryString(query)
      const api = await buildApi(config)
      const operation = config.operation || (id ? 'info' : 'list')
      const path = buildUrl(config)(id)

      if (shouldUseCache(config)(id, piece, actions.setInfoFromList)) {
        return true
      }

      const url = joinWith('?', path, queryString)
      const method = 'GET'
      debugRequests && requestLogger(url, method)
      actions.getRequest({ ...config, operation })
      return api({ method, url })
        .then(async response => {
          const parsers = ['Info', 'List', 'Fetch']
          const result = await doSuccess(path, method, config, id)(
            response,
            parsers,
          )
          return actions.getSuccess({ ...config, operation }, result)
        })
        .catch(async error => {
          const errorMessage = await doFail(path, method, config)(error)
          return actions.getFail({ ...config, operation }, errorMessage)
        })
    },
    [actions, options, piece],
  )

  const save = useCallback(
    contextOpts => async ({ $_addToTop, ...rawBody }) => {
      const config = { ...options, ...contextOpts }
      const { id, method: givenMethod } = config
      const { parseParams, debugRequests } = config
      const paramsParser = createHumps(parseParams || snakeCase)
      const api = await buildApi(config)
      const url = buildUrl(config)(id)
      const method = givenMethod || (id ? 'PUT' : 'POST')
      const data = paramsParser(omit(rawBody, 'id'))
      debugRequests && requestLogger(url, method, data)
      actions.saveRequest(config, id)
      return api({ url, method, data })
        .then(async response => {
          const parsers = ['Update', 'Create', 'Save']
          const result = await doSuccess(url, method, config, id)(
            response,
            parsers,
          )
          return actions.saveSuccess(config, { id, data: result }, $_addToTop)
        })
        .catch(async error => {
          const errorMessage = await doFail(url, method, config)(error)
          return actions.saveFail(config, { error: errorMessage, id })
        })
    },
    [actions, options],
  )

  const destroy = useCallback(
    contextOpts => async query => {
      const queryString = buildQueryString(query)
      const config = { ...options, ...contextOpts }
      const { id, debugRequests } = config
      const api = await buildApi(config)
      const path = buildUrl(config)(id)
      const url = joinWith('?', path, queryString)
      const method = 'DELETE'
      debugRequests && requestLogger(url, method)
      actions.destroyRequest(config, id)
      return api({ method, url })
        .then(async response => {
          await doSuccess(url, method, config)(response)
          return actions.destroySuccess(config, id)
        })
        .catch(async error => {
          const errorMessage = await doFail(url, method, config)(error)
          return actions.destroyFail(config, { error: errorMessage, id })
        })
    },
    [actions, options],
  )

  const setInfo = useCallback(
    (info, merge) => {
      actions.setInfo(options, info, merge)
    },
    [actions, options],
  )

  const setList = useCallback(
    (list, merge) => {
      actions.setList(options, list, merge)
    },
    [actions, options],
  )

  useEffect(() => {
    fetchOnMount && fetch({ id: options.id })(options.query)
    // eslint-disable-next-line
  }, [options.id, options.query, fetchOnMount])

  return [piece, { fetch, save, destroy, setInfo, setList }]
}

export default useCroods
