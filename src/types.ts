import { AxiosBasicCredentials } from 'axios'

export type ID = string | number

export interface CroodsState {
  info?: object
  list?: object[]
  fetchingInfo?: boolean
  fetchingList?: boolean
  saving?: boolean
  destroying?: boolean
  infoError?: string
  listError?: string
  saveError?: string
  destroyError?: string
}

export interface CroodsActions {
  fetch: (a: ActionOptions) => (b?: object) => Promise<any>
  save: (a: ActionOptions) => (b?: object) => Promise<any>
  destroy: (a: ActionOptions) => (b?: object) => Promise<any>
  setInfo: (a: object, b: boolean) => void
  setList: (a: object, b: boolean) => void
  clearMessages: () => void
  resetState: () => void
}

export type CroodsTuple = [CroodsState, CroodsActions]

export interface ProviderOptions {
  after4xx?: (t: number, a?: string, b?: object) => void
  after5xx?: (t: number, a?: string, b?: object) => void
  afterFailure?: (t: object) => void
  afterResponse?: (t: object) => void
  afterSuccess?: (t: object) => void
  baseUrl?: string
  credentials?: AxiosBasicCredentials
  handleResponseHeaders?: (t: object) => void
  headers?: (t: object) => object | object
  cache?: boolean
  debugActions?: boolean
  debugRequests?: boolean
  paramsParser?: (t: string) => string
  paramsUnparser?: (t: string) => string
  parseErrors?: (e: ServerError, a: string) => string
  parseResponse?: (t: ServerResponse) => any
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
  query?: object
  fetchOnMount?: boolean
}

export interface ActionOptions extends InstanceOptions {
  operation?: string
}

export interface FetchOptions extends InstanceOptions {
  render: (t: object | object[], b: CroodsTuple) => React.ElementType
  renderError?: (t: string) => React.ElementType
  renderEmpty?: () => React.ElementType
  renderLoading?: () => React.ElementType
}

export interface Store {
  setState: Function
  setGlobalState?: Function
  actions?: Function[]
  state: object
  listeners?: any[]
}

export interface ServerError {
  response?: {
    status?: number
    statusMessage?: string
    data?: object
  }
  request?: any
}

export interface ServerResponse {
  data?: object
}
