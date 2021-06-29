import { consoleGroup } from './logger'

import type { Method } from 'axios'
import type { ActionOptions } from '../types'
import type { ObjWithStore } from 'useStore'
import { InternalActions } from './useGlobal'

const logger =
  (dir: 'REQUEST' | 'RESPONSE' = 'REQUEST') =>
  (url: string, method: string, data?: Record<string, unknown>): void => {
    const isReq = dir === 'REQUEST'
    consoleGroup(
      `MOCK ${dir}: `,
      isReq ? 'rgb(147 112 219 / 48%)' : 'rgb(255 127 80 / 50%)',
    )(`${method.toUpperCase()}: ${url}`, data)
  }

const shouldMock = ({ mockResponse }: ActionOptions): boolean => {
  return typeof mockResponse !== 'undefined'
}

const sleep = (timeout = 0) =>
  new Promise(resolve => setTimeout(resolve, timeout))

type AttemptResult<T = any> = Promise<[string, null] | [null, T]>
const attempt = async <T = any>(
  callback: () => Promise<T>,
): AttemptResult<T> => {
  try {
    const result = await callback()
    return [null, result]
  } catch (err) {
    console.error(err)
    return [err, null]
  }
}

const getMock =
  (options: ActionOptions, actions: ObjWithStore<InternalActions>) =>
  (url: string, method: Method): Promise<any> =>
    mockBuilder(
      options,
      { url, method },
      () => actions.getRequest(options),
      (err: string) => actions.getFail(options, err),
      (result: any) => actions.getSuccess(options, result),
    )

const saveMock =
  (options: ActionOptions, actions: ObjWithStore<InternalActions>) =>
  (url: string, method: Method, data?: Record<string, unknown>): Promise<any> =>
    mockBuilder(
      options,
      { url, method, data },
      () => actions.saveRequest(options, options.id),
      (error: string) => actions.saveFail(options, { error, id: options.id }),
      (result: any) =>
        actions.saveSuccess(options, { id: options.id, data: result }),
    )

const destroyMock =
  (options: ActionOptions, actions: ObjWithStore<InternalActions>) =>
  (url: string, method: Method): Promise<any> =>
    mockBuilder(
      options,
      { url, method },
      () => actions.destroyRequest(options, options.id),
      (error: string) =>
        actions.destroyFail(options, { error, id: options.id }),
      () => actions.destroySuccess(options, options.id),
    )

const mockBuilder = async (
  { debugRequests, mockResponse, mockTimeout = 0 }: ActionOptions,
  {
    url,
    method,
    data,
  }: { url: string; method: Method; data?: Record<string, unknown> },
  requestAction: () => void,
  failAction: (err: string) => void,
  successAction: (res: any) => void,
): Promise<any> => {
  if (typeof mockResponse !== 'undefined') {
    debugRequests && logger()(url, method, data)
    requestAction()
    const [error, result] = await attempt(() =>
      mockResponse({ url, method, data }),
    )
    await sleep(mockTimeout)
    if (error) {
      failAction(error)
      return error
    }
    debugRequests && logger('RESPONSE')(url, method, result)
    successAction(result)
    return result
  }
}

export { shouldMock, getMock, saveMock, destroyMock }
