import { useEffect, useCallback } from 'react'
// @ts-ignore
import createHumps from 'lodash-humps/lib/createHumps'
import omit from 'lodash/omit'
import snakeCase from 'lodash/snakeCase'

import { buildApi } from './private/buildApi'
import { buildQueryString } from './private/buildQueryString'
import { buildUrl } from './private/buildUrl'
import { doFail } from './private/doFail'
import { doSuccess, ParserWord } from './private/doSuccess'
import { findStatePiece, getStateKey } from './private/findStatePiece'
import { joinWith } from './private/joinWith'
import { requestLogger } from './private/logger'
import { shouldUseCache } from './private/shouldUseCache'
import { useGlobal } from './private/useGlobal'
import { useBaseOptions } from './baseOptionsProvider'

import type {
  ActionOptions,
  Actions,
  ProviderOptions,
  CroodsState,
  ID,
  QueryStringObj,
  ReqBody,
  SaveOptions,
} from './types'

type CroodsTuple<T extends any = any> = [CroodsState<T>, Actions<T>]
type UseCroodsOptions = ProviderOptions & {
  name: string
  id?: ID
  path?: string
  customPath?: string
  stateId?: ID
  query?: QueryStringObj
  fetchOnMount?: boolean
}
const useCroods = <T extends any = any>({
  name,
  stateId,
  fetchOnMount,
  ...opts
}: UseCroodsOptions): CroodsTuple<T> => {
  if (typeof name !== 'string' || name.length < 1) {
    throw new Error('You must pass a name property to useCroods/Fetch')
  }
  // baseOptions -> config from provider
  const baseOptions = useBaseOptions()
  const contextPath: string = getStateKey(name, stateId)
  const [state, actions] = useGlobal(contextPath)
  const piece = findStatePiece(state, name, stateId, fetchOnMount, opts.id)

  const options: UseCroodsOptions = { ...baseOptions, ...opts, name, stateId }

  const fetch = useCallback(
    ({ requestConfig = {}, ...contextOpts }: ActionOptions = {}) =>
      async (query: QueryStringObj = {}) => {
        const config = { ...options, ...contextOpts }
        const { id, debugRequests, query: inheritedQuery } = config
        const queryString = buildQueryString(query || inheritedQuery, config)
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
        return api({ ...requestConfig, method, url })
          .then(async response => {
            const parsers = ['Info', 'List', 'Fetch'] as ParserWord[]
            const result = await doSuccess(
              path,
              method,
              config,
              id,
            )(response, parsers)
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
    ({
        onProgress: onUploadProgress,
        requestConfig = {},
        addToTop,
        ...contextOpts
      }: SaveOptions = {}) =>
      async (rawBody?: ReqBody) => {
        const config = { ...options, ...contextOpts }
        const { id, method: givenMethod } = config
        const { parseParams, paramsParser, debugRequests } = config
        const paramsParserFn = createHumps(
          parseParams || paramsParser || snakeCase,
        )
        const api = await buildApi(config)
        const url = buildUrl(config)(id)
        const method = givenMethod || (id ? 'PUT' : 'POST')
        const data = paramsParserFn(omit(rawBody, 'id'))
        debugRequests && requestLogger(url, method, data)
        actions.saveRequest(config, id)
        return api({ ...requestConfig, onUploadProgress, url, method, data })
          .then(async response => {
            const parsers = ['Update', 'Create', 'Save'] as ParserWord[]
            const result = await doSuccess(
              url,
              method,
              config,
              id,
            )(response, parsers)
            return actions.saveSuccess(config, { id, data: result }, addToTop)
          })
          .catch(async error => {
            const errorMessage = await doFail(url, method, config)(error)
            return actions.saveFail(config, { error: errorMessage, id })
          })
      },
    [actions, options],
  )

  const destroy = useCallback(
    (contextOpts: ActionOptions = {}) =>
      async (query?: QueryStringObj, requestConfig = {}) => {
        const config = { ...options, ...contextOpts }
        const { id, debugRequests, query: inheritedQuery } = config
        const queryString = buildQueryString(query || inheritedQuery, config)
        const api = await buildApi(config)
        const path = buildUrl(config)(id)
        const url = joinWith('?', path, queryString)
        const method = 'DELETE'
        debugRequests && requestLogger(url, method)
        actions.destroyRequest(config, id)
        return api({ ...requestConfig, method, url })
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
    (info: Partial<T>, merge?: boolean) => {
      actions.setInfo(options, info, merge)
    },
    [actions, options],
  )

  const setList = useCallback(
    (list: Partial<T>[], merge?: boolean) => {
      actions.setList(options, list, merge)
    },
    [actions, options],
  )

  useEffect(() => {
    fetchOnMount && fetch({ id: options.id })(options.query)
  }, [options.id, options.query, fetchOnMount])

  return [
    piece,
    {
      fetch,
      save,
      destroy,
      setInfo,
      setList,
      dangerouslyResetCroodsState: actions.resetState,
    },
  ]
}

export { useCroods }
export type { CroodsTuple, UseCroodsOptions }
