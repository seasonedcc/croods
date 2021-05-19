import { AxiosBasicCredentials, AxiosResponse } from 'axios'

export type Configuration = {
  [key: string]: any
}
export type ID = string | number
type MaybeString = string | null | undefined
export interface CroodsState {
  info: any
  list: any[]
  fetchingInfo?: boolean
  fetchingList?: boolean
  saving?: boolean
  destroying?: boolean
  infoError: MaybeString
  listError: MaybeString
  saveError: MaybeString
  destroyError: MaybeString
}

export interface CroodsActions {
  fetch: (a: ActionOptions) => (b?: Configuration) => Promise<any>
  save: (a: ActionOptions) => (b?: Configuration) => Promise<any>
  destroy: (a: ActionOptions) => (b?: Configuration) => Promise<any>
  setInfo: (a: Configuration | null, b?: boolean) => void
  setList: (a: Configuration | null, b?: boolean) => void
  clearMessages: () => void
  resetState: () => void
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

export interface HydrateOptions {
  name: string
  stateId?: ID
  type?: 'list' | 'info'
  value: any
}

type HTTPMethod = 'POST' | 'PUT' | 'PATCH'

export interface ActionOptions extends ProviderOptions {
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
  render: (t: Configuration | any[] | null, b: CroodsTuple) => React.ElementType
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
