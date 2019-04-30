import { useContext, useEffect, useMemo } from 'react'
import createHumps from 'lodash-humps/lib/createHumps'
import omit from 'lodash/omit'
import snakeCase from 'lodash/snakeCase'

import Context from './Context'

import buildApi from './buildApi'
import buildQueryString from './buildQueryString'
import buildUrl from './buildUrl'
import doFail from './doFail'
import doSuccess from './doSuccess'
import findStatePiece from './findStatePiece'
import joinWith from './joinWith'
import shouldUseCache from './shouldUseCache'
import useGlobal from './store'
import { requestLogger } from './logger'

const defaultParseResponse = ({ data }) => data
const defaultParseParams = snakeCase

const useCroods = ({ name, stateId, ...opts }, autoFetch) => {
  const baseOptions = useContext(Context)
  const [state, actions] = useGlobal()
  const piece = useMemo(() => findStatePiece(state, name, stateId), [
    name,
    state,
    stateId,
  ])

  const options = { ...baseOptions, ...opts, name, stateId }
  const { id: givenId, debugRequests, query } = options
  const { parseParams, parseResponse } = options
  const paramsParser = useMemo(
    () => createHumps(parseParams || defaultParseParams),
    [parseParams],
  )

  const fetch = useMemo(
    () => async id => {
      const queryString = buildQueryString(query)
      const api = await buildApi(options)
      const operation = id ? 'info' : 'list'
      const path = buildUrl(options)(id)

      if (shouldUseCache(options)(id, piece, actions.setInfo)) return true

      const fullPath = joinWith('?', path, queryString)
      debugRequests && requestLogger(fullPath, 'GET')
      actions.getRequest({ ...options, operation })
      return api
        .get(fullPath)
        .then(async response => {
          const {
            parseInfoResponse,
            parseListResponse,
            parseFetchResponse,
          } = options
          const parser =
            (id ? parseInfoResponse : parseListResponse) ||
            parseFetchResponse ||
            parseResponse ||
            defaultParseResponse
          const result = await doSuccess(path, 'GET', options)(response, parser)
          return actions.getSuccess({ ...options, operation }, result)
        })
        .catch(async error => {
          await doFail(path, 'GET', options)(error)
          return actions.getFail({ ...options, operation }, error)
        })
    },
    [actions, debugRequests, options, parseResponse, piece, query],
  )

  const save = useMemo(
    () => id => async ({ $_addToTop, ...rawBody }) => {
      const api = await buildApi(options)
      const path = buildUrl(options)(id)
      const method = id ? 'PUT' : 'POST'
      const body = paramsParser(omit(rawBody, 'id'))
      debugRequests && requestLogger(path, method, body)
      actions.saveRequest(options, id)
      const axiosMethod = id ? api.put : api.post
      return axiosMethod(path, body)
        .then(async response => {
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
          const result = await doSuccess(path, method, options)(
            response,
            parser,
          )
          return actions.saveSuccess(options, { id, data: result }, $_addToTop)
        })
        .catch(async error => {
          await doFail(path, method, options)(error)
          return actions.saveFail(options, { error, id })
        })
    },
    [actions, debugRequests, options, paramsParser, parseResponse],
  )

  const destroy = useMemo(
    () => id => async () => {
      const idToDestroy = id || givenId
      if (!idToDestroy) return false
      const api = await buildApi(options)
      const path = buildUrl(options)(idToDestroy)
      debugRequests && requestLogger(path, 'DELETE')
      actions.destroyRequest(options, idToDestroy)
      return api
        .delete(path)
        .then(async response => {
          await doSuccess(path, 'DELETE', options)(response)
          return actions.destroySuccess(options, idToDestroy)
        })
        .catch(async error => {
          await doFail(path, 'DELETE', options)(error)
          return actions.destroyFail(options, { error, id: idToDestroy })
        })
    },
    [actions, debugRequests, givenId, options],
  )

  useEffect(() => {
    autoFetch && fetch(givenId)
    // eslint-disable-next-line
  }, [givenId, autoFetch])

  return [piece, { fetch, save, destroy }]
}

export default useCroods
