import { AxiosRequestConfig } from 'axios'

export type CroodsData = Info | Info[]
export type Info = any
export type ReqBody = Record<string, unknown>
export type ID = string | number
export type CroodsResponse = CroodsData | boolean | null
export type QueryStringObj = Record<string, string | number | boolean>
export type URIString = `${'http:' | 'https:' | ':'}//${string}.${string}`
export type FetchType = 'info' | 'list'
export type Operation = 'INFO' | 'LIST' | 'SAVE' | 'DESTROY' | 'SET' | 'CLEAR'
export type ActionType =
  | 'REQUEST'
  | 'SUCCESS'
  | 'FAIL'
  | 'INFO'
  | 'LIST'
  | 'MESSAGES'
  | 'STATE PIECE'
export type Credentials = { username: string; password: string }

export type SaveOptions = ActionOptions & {
  onProgress?: (progressEvent: ProgressEvent) => void | undefined
  addToTop?: boolean
}

export type CroodsState = {
  info: Info
  list: Info[]
  fetchingInfo?: boolean
  fetchingList?: boolean
  saving?: boolean
  destroying?: boolean
  infoError?: string | null
  listError?: string | null
  saveError?: string | null
  destroyError?: string | null
}

export type CroodsActions = {
  fetch: (a: ActionOptions) => (b?: QueryStringObj) => Promise<CroodsResponse>
  save: (a: SaveOptions) => (b?: ReqBody) => Promise<CroodsResponse>
  destroy: (a: ActionOptions) => (b?: QueryStringObj) => Promise<CroodsResponse>
  setInfo: (a: Info, b?: boolean) => void
  setList: (a: Info[], b?: boolean) => void
  clearMessages: () => void
  resetState: () => void
}

export type CroodsTuple = [CroodsState, CroodsActions]

export type HeadersObj = Record<string, string>
export type CroodsProviderOptions = {
  after4xx?: (t: number, a?: string, b?: ServerResponseData) => void
  after5xx?: (t: number, a?: string, b?: ServerResponseData) => void
  afterFailure?: (t: ServerResponse) => void // TODO: normalize with afterSuccess
  afterResponse?: (t: ServerResponseBody) => void
  afterSuccess?: (t: ServerResponseBody) => void
  baseUrl?: URIString
  cache?: boolean
  credentials?: Credentials
  debugActions?: boolean
  debugRequests?: boolean
  handleResponseHeaders?: (t: ServerResponseBody) => void
  headers?: ((t: HeadersObj) => HeadersObj) | HeadersObj
  paramsParser?: (t: string) => string
  paramsUnparser?: (t: string) => string
  parseErrors?: (e: ServerResponse, a: string) => string
  parseParams?: (t: string) => string // TODO: REMOVE
  parseResponse?: (t: ServerResponse) => CroodsData
  parseFetchResponse?: (t: ServerResponse) => CroodsData
  parseListResponse?: (t: ServerResponse) => CroodsData
  parseInfoResponse?: (t: ServerResponse) => CroodsData
  parseSaveResponse?: (t: ServerResponse) => CroodsData
  parseCreateResponse?: (t: ServerResponse) => CroodsData
  parseUpdateResponse?: (t: ServerResponse) => CroodsData
  queryStringParser?: (t: string) => string
  renderEmpty?: () => React.ReactNode
  renderError?: (t: string) => React.ReactNode
  renderLoading?: () => React.ReactNode
  requestTimeout?: number
  urlParser?: (t: string) => string
}
export type ProviderElement = CroodsProviderOptions & {
  children: React.ReactNode
}

export type UseCroodsOptions = CroodsProviderOptions & {
  name: string
  id?: ID
  path?: string
  customPath?: string
  stateId?: ID
  query?: QueryStringObj
  fetchOnMount?: boolean
}
export type FetchOptions = UseCroodsOptions & {
  render: (t: CroodsData | null, b: CroodsTuple) => React.ReactNode
}

export type ActionOptions = CroodsProviderOptions & {
  requestConfig?: AxiosRequestConfig // TODO:  REMOVE
  operation?: FetchType
  name?: string
  id?: ID
  path?: string
  customPath?: string
  stateId?: ID
  query?: QueryStringObj
  fetchOnMount?: boolean
  method?: HTTPMethod
}

export type HydrateOptions = {
  name: string
  stateId?: ID
  type?: FetchType
  value: CroodsData
}

// Types for Server req/res
export type ServerResponse<T = Record<string, unknown>> = {
  response: ServerResponseBody<T>
  headers: Record<string, string>
  request: Record<string, any>
  message?: string
}
export type ServerResponseBody<T = Record<string, unknown>> = {
  status?: number
  statusMessage?: string
  data?: ServerResponseData<T>
}
export type ServerResponseData<T = Record<string, unknown>> = T
export type HTTPMethod =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'PATCH'
  | 'DELETE'
  | 'HEAD'
  | 'OPTIONS'

// Types for useGlobal
export type GlobalState = {
  [key: string]: CroodsState
}
export type Action = (t: Store, ...args: any[]) => any
export type BindedAction<T> = T extends (...a: [Store, ...infer P]) => infer R
  ? (...a: P) => R
  : never
export type Actions = {
  [key: string]: Action
}
export type Listener = [string | undefined, React.Dispatch<any>]
export type Store = {
  setState(t: Record<string, unknown>, p?: string): void
  actions?: Actions
  state: GlobalState
  listeners?: Listener[]
}
