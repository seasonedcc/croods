import { AxiosBasicCredentials, AxiosResponse } from 'axios'

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
  fetch: (a: ActionOptions) => (b?: Object) => Promise<any>
  save: (a: ActionOptions) => (b?: Object) => Promise<any>
  destroy: (a: ActionOptions) => (b?: Object) => Promise<any>
  setInfo: (a: Object, b?: boolean) => void
  setList: (a: Object, b?: boolean) => void
  clearMessages: () => void
  resetState: () => void
}

export type CroodsTuple = [CroodsState, CroodsActions]

export interface ProviderOptions {
  after4xx?: (t: number, a?: string, b?: Object) => void
  after5xx?: (t: number, a?: string, b?: Object) => void
  afterFailure?: (t: Object) => void
  afterResponse?: (t: Object) => void
  afterSuccess?: (t: Object) => void
  baseUrl?: string
  credentials?: AxiosBasicCredentials
  handleResponseHeaders?: (t: Object) => void
  headers?: (t: Object) => Object | Object
  cache?: boolean
  debugActions?: boolean
  debugRequests?: boolean
  paramsParser?: (t: string) => string
  paramsUnparser?: (t: string) => string
  parseErrors?: (e: ServerError, a: string) => string
  parseResponse?: (t: AxiosResponse) => any
  renderError?: (t: string) => React.ElementType
  renderEmpty?: () => React.ElementType
  renderLoading?: () => React.ElementType
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
  query?: Object
  fetchOnMount?: boolean
}

enum HTTPMethod {
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
}
export interface ActionOptions extends ProviderOptions {
  operation?: 'info' | 'list'
  name?: string
  id?: ID
  path?: string
  customPath?: string
  stateId?: ID
  query?: Object
  fetchOnMount?: boolean
  method?: HTTPMethod
}

export interface FetchOptions extends InstanceOptions {
  render: (t: Object | any[] | null, b: CroodsTuple) => React.ElementType
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
  setState: Function
  setGlobalState?: Function
  actions?: Actions
  state: GlobalState
  listeners?: Listener[]
}

export interface ServerError {
  response?: {
    status?: number
    statusMessage?: string
    data?: Object
  }
  request?: any
  message?: string
}

export interface ProviderElement extends ProviderOptions {
  children: React.ElementType
}
