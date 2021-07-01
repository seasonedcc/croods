type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD' | 'OPTIONS'
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

type SaveOptions = {
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

type Actions<T = any> = {
  destroy: (a?: ActionOptions) => () => Promise<T>
  fetch: (a?: ActionOptions) => () => Promise<T>
  save: (a?: ActionOptions, b?: SaveOptions) => (b?: ReqBody) => Promise<T>
  setInfo: (a: Partial<T>, b?: boolean) => void
  setList: (a: T[], b?: boolean) => void
}

type HeadersObj = Record<string, string>
type ProviderOptions = {
  after4xx?: (t: number, a?: string) => void
  after5xx?: (t: number, a?: string) => void
  afterFailure?: (t: Response | null) => void
  afterResponse?: (t: Response) => void
  afterSuccess?: (t: Response) => void
  baseUrl?: URIString
  cache?: boolean
  credentials?: { username: string; password: string }
  debugActions?: boolean
  debugRequests?: boolean
  handleResponseHeaders?: (t: Response) => void
  headers?: ((t: HeadersObj) => HeadersObj) | HeadersObj
  mockFetch?: typeof fetch
  mockTimeout?: number
  paramsParser?: (t: string) => string
  paramsUnparser?: (t: string) => string
  parseErrors?: (e: Response, a: string) => string
  parseResponse?: (t: Response) => CroodsData
  parseFetchResponse?: (t: Response) => CroodsData
  parseListResponse?: (t: Response) => any[]
  parseInfoResponse?: (t: Response) => any
  parseSaveResponse?: (t: Response) => any
  parseCreateResponse?: (t: Response) => any
  parseUpdateResponse?: (t: Response) => any
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
  method?: HttpMethod
  name?: string
  operation?: FetchType
  path?: string
  query?: QueryStringObj
  stateId?: ID
  updateRoot?: boolean // TODO: Add to Docs
  updateRootInfo?: boolean // TODO: Add to Docs
  updateRootList?: boolean // TODO: Add to Docs
}

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
  HttpMethod,
  ID,
  Info,
  QueryStringObj,
  ReqBody,
  SaveOptions,
}
