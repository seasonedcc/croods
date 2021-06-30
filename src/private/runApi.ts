import type { ActionOptions, HeadersObj, ReqBody, SaveOptions } from 'types'
import type { ObjWithStore } from '../useStore'
import { buildApi } from './buildApi'
import type { InternalActions } from './useGlobal'

type RequestType =
  { kind: 'fetch' }
  | { kind: 'destroy' }
  | { kind: 'save', options: SaveOptions }

type Request = {
  actions: ObjWithStore<InternalActions>,
  options: ActionOptions,
  requestType: RequestType
}

const defaultHeaders: HeadersObj = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
}

async function runApi<T>({ actions, options, requestType }: Request): Promise<(body: ReqBody) => Promise<T>> {
  const { headers, baseUrl } = options
  const customHeaders = await (typeof headers === 'function'
    ? headers(defaultHeaders)
    : headers)
  return async (body?: ReqBody) => {
    const config = {
      method: 'GET', // body ? 'POST' : 'GET',
      headers: customHeaders,
      body: body ? JSON.stringify(body) : undefined,
    }
    return fetch(baseUrl, { headers: customHeaders }).then(async response => {
      if (response.ok) {
        return await response.json()
      } else {
        const errorMessage = await response.text()
        return Promise.reject(new Error(errorMessage))
      }
    })
  }
}

export { runApi }


/*
ProviderOptions
UseCroodsOptions

ActionOptions

SaveOptions {
  onProgress: onUploadProgress,
  addToTop
}

type Request = {
  ObjWithStore<InternalActions>,
  ActionOptions,
  RequestType {
    FetchRequest
    | DestroyRequest
    | SaveRequest {
      SaveOptions,
      ReqBody
    }
  }
  runApi<T> : Request -> Promise<T>
  | ...
*/
// FETCH
// const { id, debugRequests, query: inheritedQuery } = config
// const queryString = buildQueryString(query || inheritedQuery, config)
// const api = await buildApi(config)
// const operation = config.operation || (id ? 'info' : 'list')
// const path = buildUrl(config)(id)

// if (shouldUseCache(config)(id, piece, actions.setInfoFromList)) {
//   return true
// }

// const url = joinWith('?', path, queryString)
// const method = 'GET'
// debugRequests && requestLogger(url, method)
// actions.getRequest({ ...config, operation })

// SAVE
// const { id, method: givenMethod } = config
// const { parseParams, paramsParser, debugRequests } = config
// const paramsParserFn = createHumps(parseParams || paramsParser || snakeCase)
// const api = await buildApi(config)
// const url = buildUrl(config)(id)
// const method = givenMethod || (id ? 'PUT' : 'POST')
// const data = paramsParserFn(omit(rawBody, 'id'))
// debugRequests && requestLogger(url, method, data)
// actions.saveRequest(config, id)

// DESTROY
// const { id, debugRequests, query: inheritedQuery } = config
// const queryString = buildQueryString(query || inheritedQuery, config)
// const api = await buildApi(config)
// const path = buildUrl(config)(id)
// const url = joinWith('?', path, queryString)
// const method = 'DELETE'
// debugRequests && requestLogger(url, method)
// actions.destroyRequest(config, id)
