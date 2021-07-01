import { snakeCase, omit } from 'lodash'
// @ts-ignore
import createHumps from 'lodash-humps/lib/createHumps'

import { buildQueryString } from './buildQueryString'
import { buildUrl } from './buildUrl'
import { doFail } from './doFail'
import { doSuccess } from './doSuccess'
import { joinWith } from './joinWith'
import { requestLogger, responseLogger } from './logger'
import type { InternalActions } from './useGlobal'
import { attempt, sleep } from './utils'

import type {
  ActionOptions,
  CroodsState,
  HeadersObj,
  HttpMethod,
  ReqBody,
  SaveOptions,
} from 'types'
import type { ObjWithStore } from '../useStore'

type RequestType =
  | { kind: 'fetch'; piece: CroodsState }
  | { kind: 'destroy' }
  | { kind: 'save'; options: SaveOptions }

type Request = {
  actions: ObjWithStore<InternalActions>
  options: ActionOptions
  requestType: RequestType
}

const getMethod = (options: ActionOptions, type: RequestType): HttpMethod => {
  if (typeof options.method === 'string') return options.method
  switch (type.kind) {
    case 'fetch':
      return 'GET'
    case 'destroy':
      return 'DELETE'
    case 'save':
      return options.id ? 'PUT' : 'POST'
  }
}

const getHeaders = async (options: ActionOptions): Promise<HeadersObj> => {
  const defaultHeaders: HeadersObj = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  }
  return typeof options.headers === 'function'
    ? options.headers(defaultHeaders)
    : { ...defaultHeaders, ...options.headers }
}

const getUrl = (options: ActionOptions): string => {
  const path = buildUrl(options)
  const queryString = buildQueryString(options)
  return joinWith('?', path, queryString)
}

const shouldUseCache = ({ options, requestType }: Request): boolean => {
  return Boolean(
    requestType.kind === 'fetch' &&
      Boolean(requestType.piece?.list?.length) &&
      options.cache,
  )
}

const requestAction = ({ actions, options, requestType }: Request): boolean => {
  switch (requestType.kind) {
    case 'fetch':
      return actions.getRequest(options)
    case 'save':
      return actions.saveRequest(options)
    case 'destroy':
      return actions.destroyRequest(options)
  }
}

const successAction = <T = any>(
  { actions, options, requestType }: Request,
  result: T,
): T => {
  switch (requestType.kind) {
    case 'fetch':
      return actions.getSuccess(options, result)
    case 'save':
      return actions.saveSuccess(options, result)
    case 'destroy':
      return actions.destroySuccess(options)
  }
}

const failureAction = (
  { actions, options, requestType }: Request,
  error: string,
): false => {
  switch (requestType.kind) {
    case 'fetch':
      return actions.getFail(options, error)
    case 'save':
      return actions.saveFail(options, error)
    case 'destroy':
      return actions.destroyFail(options, error)
  }
}

async function mock(options: ActionOptions): Promise<Response> {
  await sleep(options.mockTimeout || 0)
  const [error, result] = await attempt(
    () => options.mockResponse?.() || Promise.resolve(),
  )
  if (error) {
    return {
      ok: false,
      text: () => Promise.resolve(error),
    } as Response
  }
  return {
    ok: true,
    json: () => Promise.resolve(result),
  } as Response
}

async function runApi(
  request: Request,
): Promise<(body?: ReqBody) => Promise<any>> {
  const { actions, options, requestType } = request
  const url = getUrl(options)
  const headers = await getHeaders(options)
  const method = getMethod(options, requestType)
  return async (body?: ReqBody) => {
    const config = { method, headers } as RequestInit
    if (body) {
      const parseParams = createHumps(options.paramsParser || snakeCase)
      const data = parseParams(omit(body, 'id'))
      config.body = JSON.stringify(data)
    }
    if (requestType.kind === 'fetch' && shouldUseCache(request)) {
      const result = options.id
        ? actions.setInfoFromList(options)
        : requestType.piece.list
      return Promise.resolve(result)
    }
    const isMock = typeof options.mockResponse !== 'undefined'
    options.debugRequests && requestLogger(url, method, {}, isMock)
    requestAction(request)
    const [error, response] = await attempt(() =>
      options.mockResponse ? mock(options) : fetch(url, config),
    )
    options.debugRequests &&
      responseLogger(url, method, response || error, isMock)
    if (response?.ok) {
      const result = await doSuccess(request, response)
      return successAction(request, result)
    }
    const errorMessage = response ? await response.text() : error
    failureAction(request, errorMessage || '')
    return doFail(options, errorMessage || '', response)
  }
}

export { runApi }
export type { Request }
