import { Method } from 'axios'
import compact from 'lodash/compact'
import toUpper from 'lodash/toUpper'
import type { ServerResponse } from './types'

const consoleGroup =
  (title: string, color?: string) =>
  (...log: unknown[]): void => {
    // eslint-disable-next-line
    console.group(`%c${title}`, `color: ${color};`)
    // eslint-disable-next-line
    log.map(info => console.log(info))
    // eslint-disable-next-line
    console.groupEnd()
  }

const responseLogger = (
  url: string,
  method: string,
  response?: ServerResponse,
): void => {
  consoleGroup('RESPONSE: ', 'coral')(
    `${method.toUpperCase()}: ${url}`,
    response?.data,
  )
}

const requestLogger = (
  url: string,
  method: Method,
  params?: Record<string, unknown>,
): void => {
  consoleGroup(
    'REQUEST: ',
    'mediumpurple',
  )(...compact([`${toUpper(method)}: ${url}`, params]))
}

export { consoleGroup, responseLogger, requestLogger }
