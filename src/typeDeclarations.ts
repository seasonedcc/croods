import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'

export type CroodsData = Info | Info[]
export type Info = any
export type ReqBody = Record<string, unknown>
export type ID = string | number
export type ActionResponse = CroodsData | boolean | null
export type QueryStringObj = Record<
  string,
  string | number | boolean | Array<string | number>
>
export type URIString = `${'http:' | 'https:' | ':'}//${string}.${string}`
export type FetchType = 'info' | 'list'
export type Operation = 'INFO' | 'LIST' | 'SAVE' | 'DESTROY' | 'SET'
export type ActionType = 'REQUEST' | 'SUCCESS' | 'FAIL' | 'INFO' | 'LIST'
export type Credentials = { username: string; password: string }

export type SaveOptions = ActionOptions & {
  onProgress?: (progressEvent: ProgressEvent) => void | undefined
  addToTop?: boolean
}

export type CroodsStateFlags = {
  fetchingInfo?: boolean
  fetchingList?: boolean
  saving?: boolean
  destroying?: boolean
  infoError?: string | null
  listError?: string | null
  saveError?: string | null
  destroyError?: string | null
}
export type CroodsState = CroodsStateFlags & {
  info: Info
  list: Info[]
}

export type CroodsActions = {
  fetch: <T = ActionResponse>(
    a: ActionOptions,
  ) => (b?: QueryStringObj) => Promise<T>
  save: <T = ActionResponse>(a: SaveOptions) => (b?: ReqBody) => Promise<T>
  destroy: <T = ActionResponse>(
    a: ActionOptions,
  ) => (b?: QueryStringObj) => Promise<T>
  setInfo: (a: Info, b?: boolean) => void
  setList: (a: Info[], b?: boolean) => void
}

export type CroodsTuple = [CroodsState, CroodsActions]

export type HeadersObj = Record<string, string>
export type CroodsProviderOptions = {
  after4xx?: (t: number, a?: string, b?: JSONValue) => void
  after5xx?: (t: number, a?: string, b?: JSONValue) => void
  afterFailure?: (t: ServerError) => void // TODO: normalize with afterSuccess
  afterResponse?: (t: ServerResponse) => void
  afterSuccess?: (t: ServerResponse) => void
  baseUrl?: URIString
  cache?: boolean
  credentials?: Credentials
  debugActions?: boolean
  debugRequests?: boolean
  handleResponseHeaders?: (t: ServerResponse) => void
  headers?: ((t: HeadersObj) => HeadersObj) | HeadersObj
  paramsParser?: (t: string) => string
  paramsUnparser?: (t: string) => string
  parseErrors?: (e: ServerError, a: string) => string
  parseParams?: (t: string) => string // TODO: REMOVE
  parseResponse?: (t: ServerResponse) => CroodsData
  parseFetchResponse?: (t: ServerResponse) => CroodsData
  parseListResponse?: (t: ServerResponse) => Info[]
  parseInfoResponse?: (t: ServerResponse) => Info
  parseSaveResponse?: (t: ServerResponse) => Info
  parseCreateResponse?: (t: ServerResponse) => Info
  parseUpdateResponse?: (t: ServerResponse) => Info
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
export type FetchOptions = Omit<UseCroodsOptions, 'fetchOnMount'> & {
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
  method?: HTTPMethod
}

export type HydrateOptions = {
  name: string
  stateId?: ID
  type?: FetchType
  value: CroodsData
}

// Types for Server req/res
type JSONPrimitive = string | number | boolean | null
type JSONObject = { [member: string]: JSONValue | unknown }
type JSONArray = Array<JSONValue>
export type JSONValue = JSONPrimitive | JSONObject | JSONArray

export type ServerResponse = AxiosResponse
export type ServerError = AxiosError

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
export type WithStore<T> = T extends (...a: [Store<T>, ...infer P]) => infer R
  ? (...a: P) => R
  : never
export type ObjWithStore<T extends Record<string, any>> = {
  [K in keyof T]: WithStore<T[K]>
}
export type Listener = [string | undefined, React.Dispatch<any>]
export type Store<T = Record<string, any>, U = Record<string, any>> = {
  setState(t: Record<string, unknown>, p?: string): void
  actions?: ObjWithStore<T>
  state: U
  listeners?: Listener[]
}
