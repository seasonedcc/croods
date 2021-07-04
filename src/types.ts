import type {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  Method,
} from 'axios'

type FetchType = 'info' | 'list'
type CroodsData = Info | Info[]
type Info<T = any> = T &
  Partial<
    Pick<CroodsState, 'destroyError' | 'destroying' | 'saveError' | 'saving'>
  >
type ReqBody = Record<string, unknown>
type ID = string | number
type QueryStringObj = Record<
  string,
  string | number | boolean | Array<string | number>
>
type URIString = `${'http:' | 'https:' | ''}//${string}.${string}`

type SaveOptions = ActionOptions & {
  addToTop?: boolean
  onProgress?: (progressEvent: ProgressEvent) => void | undefined
}

type CroodsState<T extends any = any> = {
  info: Info<T>
  list: Array<Info<T>>
  destroyError: string | null
  destroying: boolean
  fetchingInfo: boolean
  fetchingList: boolean
  infoError: string | null
  listError: string | null
  saveError: string | null
  saving: boolean
}

type Destroy<T = any> = <B = T>(
  a?: ActionOptions,
) => (b?: QueryStringObj) => Promise<Info<B>>
type Fetch<T = any> = <B = T>(a?: ActionOptions) => (b?: QueryStringObj) => Promise<Info<B>>
type Save<T = any> = <B = T>(a?: SaveOptions) => (b?: ReqBody) => Promise<Info<B>>
type SetInfo<T = any> = <B = Partial<T>>(a: B, b?: boolean) => void
type SetList<T = any> = <B = T>(a: B[], b?: boolean) => void

type Actions<T = any> = {
  destroy: Destroy<T>
  fetch: Fetch<T>
  save: Save<T>
  setInfo: SetInfo<T>
  setList: SetList<T>
}

type HeadersObj = Record<string, string>
type ProviderOptions = {
  after4xx?: (t: number, a?: string, b?: JSONValue) => void
  after5xx?: (t: number, a?: string, b?: JSONValue) => void
  afterFailure?: (t: ServerError) => void // TODO: normalize with afterSuccess
  afterResponse?: (t: ServerResponse) => void
  afterSuccess?: (t: ServerResponse) => void
  baseUrl?: URIString
  cache?: boolean
  credentials?: { username: string; password: string }
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

type ActionOptions = ProviderOptions & {
  customPath?: string
  id?: ID
  method?: Method
  name?: string
  operation?: FetchType
  path?: string
  query?: QueryStringObj
  requestConfig?: AxiosRequestConfig // TODO:  REMOVE
  stateId?: ID
  updateRoot?: boolean // TODO: Add to Docs
  updateRootInfo?: boolean // TODO: Add to Docs
  updateRootList?: boolean // TODO: Add to Docs
}

// Types for Server req/res
type JSONPrimitive = string | number | boolean | null
type JSONObject = { [member: string]: JSONValue | unknown }
type JSONArray = Array<JSONValue>
type JSONValue = JSONPrimitive | JSONObject | JSONArray

type ServerResponse = AxiosResponse
type ServerError = AxiosError

type GlobalState = {
  [key: string]: CroodsState
}

export type {
  ActionOptions,
  Actions,
  CroodsData,
  ProviderOptions,
  CroodsState,
  FetchType,
  GlobalState,
  HeadersObj,
  ID,
  Info,
  JSONValue,
  QueryStringObj,
  ReqBody,
  SaveOptions,
  ServerError,
  ServerResponse,
}
