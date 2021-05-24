import compact from 'lodash/compact'
import toUpper from 'lodash/toUpper'
import type { HTTPMethod } from './typeDeclarations'

export const consoleGroup =
  (title: string, color?: string) =>
  (...log: unknown[]): void => {
    // eslint-disable-next-line
    console.group(`%c${title}`, `color: ${color};`)
    // eslint-disable-next-line
    log.map(info => console.log(info))
    // eslint-disable-next-line
    console.groupEnd()
  }

export const responseLogger = (
  url: string,
  method: string,
  data: Record<string, unknown>,
): void => {
  consoleGroup('RESPONSE: ', 'coral')(`${method.toUpperCase()}: ${url}`, data)
}

export const requestLogger = (
  url: string,
  method: HTTPMethod,
  params?: Record<string, unknown>,
): void => {
  consoleGroup(
    'REQUEST: ',
    'mediumpurple',
  )(...compact([`${toUpper(method)}: ${url}`, params]))
}
