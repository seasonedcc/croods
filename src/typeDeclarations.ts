import { AxiosBasicCredentials, AxiosResponse } from 'axios'

export type Configuration = {
  [key: string]: any
}

export type Info = any
export type ReqBody = Record<string, any>
export type ID = string | number
export type CroodsResponse = any
export interface CroodsState {
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

export type QueryStringObj = Record<string, string | number | boolean>
export type CroodsActions = {
  fetch: (a: ActionOptions) => (b?: QueryStringObj) => Promise<CroodsResponse>
  save: (a: SaveOptions) => (b?: ReqBody) => Promise<CroodsResponse>
  destroy: (a: ActionOptions) => (b?: QueryStringObj) => Promise<CroodsResponse>
  setInfo: (a: Info, b?: boolean) => void
  setList: (a: Info[], b?: boolean) => void
  clearMessages: () => void
  resetState: () => void
}
export type SaveOptions = ActionOptions & {
  onProgress?: (progressEvent: any) => void | undefined
  addToTop?: boolean
}

export type CroodsTuple = [CroodsState, CroodsActions]

export interface ProviderOptions {
  after4xx?: (t: number, a?: string, b?: Configuration) => void
  after5xx?: (t: number, a?: string, b?: Configuration) => void
  afterFailure?: (t: Configuration) => void
  afterResponse?: (t: Configuration) => void
  afterSuccess?: (t: Configuration) => void
  baseUrl?: string
  credentials?: AxiosBasicCredentials
  handleResponseHeaders?: (t: Configuration) => void
  headers?: ((t: Configuration) => Configuration) | Configuration
  cache?: boolean
  debugActions?: boolean
  debugRequests?: boolean
  paramsParser?: (t: string) => string
  parseParams?: (t: string) => string // TO REMOVE
  paramsUnparser?: (t: string) => string
  parseErrors?: (e: ServerError, a: string) => string
  parseResponse?: (t: AxiosResponse) => any
  queryStringParser?: (t: string) => string
  renderError?: (t: string) => React.ReactNode
  renderEmpty?: () => React.ReactNode
  renderLoading?: () => React.ReactNode
  requestTimeout?: number
  updateRoot?: boolean
  updateRootInfo?: boolean
  updateRootList?: boolean
  urlParser?: (t: string) => string
}

export interface InstanceOptions extends ProviderOptions {
  name: string
  id?: ID
  path?: string
  customPath?: string
  stateId?: ID
  query?: Configuration
  fetchOnMount?: boolean
}

export type HydrateOptions = {
  name: string
  stateId?: ID
  type?: 'list' | 'info'
  value: any
}

type HTTPMethod = 'POST' | 'PUT' | 'PATCH'
export interface ActionOptions extends ProviderOptions {
  requestConfig?: any // TO REMOVE
  operation?: 'info' | 'list'
  name?: string
  id?: ID
  path?: string
  customPath?: string
  stateId?: ID
  query?: Configuration
  fetchOnMount?: boolean
  method?: HTTPMethod
}

export interface FetchOptions extends InstanceOptions {
  render: (t: Configuration | any[] | null, b: CroodsTuple) => React.ReactNode
}

export interface GlobalState {
  [key: string]: CroodsState
}

export interface Action {
  (t: Store, ...args: any[]): any
}

export interface Actions {
  [key: string]: Action | Actions
}
export type Listener = [string | undefined, React.Dispatch<any>]
export interface Store {
  setState(t: Record<string, unknown>, p?: string): void
  setGlobalState?(t: Record<string, unknown>): void
  actions?: Actions
  state: GlobalState
  listeners?: Listener[]
}

export interface ServerError {
  response?: {
    status?: number
    statusMessage?: string
    data?: Configuration
  }
  request?: any
  message?: string
}

export interface ProviderElement extends ProviderOptions {
  children: React.ReactNode
}
