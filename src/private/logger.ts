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

const responseLogger = (
  url: string,
  method: string,
  response?: unknown,
): void => {
  consoleGroup('RESPONSE: ', 'coral')(
    `${method.toUpperCase()}: ${url}`,
    response,
  )
}

const requestLogger = (
  url: string,
  method: HttpMethod,
  params?: Record<string, unknown>,
): void => {
  consoleGroup(
    'REQUEST: ',
    'mediumpurple',
  )(...compact([`${toUpper(method)}: ${url}`, params]))
}

export { consoleGroup, responseLogger, requestLogger }
