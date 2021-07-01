import compact from 'lodash/compact'
import toUpper from 'lodash/toUpper'

import type { HttpMethod } from 'types'

const consoleGroup =
  (title: string, color?: string) =>
  (...log: unknown[]): void => {
    console.group(`%c${title}`, `color: ${color};`)
    log.map(info => console.log(info))
    console.groupEnd()
  }

const mockLogs = (
  isMock: boolean,
  word: string,
  color: string,
): [string, string] => {
  return [
    (isMock ? 'MOCK ' : '') + word + ': ',
    `rgb(${color} / ${isMock ? '50' : '100'}%)`,
  ]
}
const responseLogger = (
  url: string,
  method: string,
  response?: unknown,
  isMock?: boolean,
): void => {
  consoleGroup(...mockLogs(Boolean(isMock), 'RESPONSE', '255 127 80'))(
    `${method.toUpperCase()}: ${url}`,
    response,
  )
}

const requestLogger = (
  url: string,
  method: HttpMethod,
  params?: Record<string, unknown>,
  isMock?: boolean,
): void => {
  consoleGroup(...mockLogs(Boolean(isMock), 'REQUEST', '147 112 219'))(
    ...compact([`${toUpper(method)}: ${url}`, params]),
  )
}

export { consoleGroup, responseLogger, requestLogger }
