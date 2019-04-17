import compact from 'lodash/compact'
import toUpper from 'lodash/toUpper'

export const consoleGroup = (title, color) => (...log) => {
  // eslint-disable-next-line
  console.group(`%c${title}`, `color: ${color};`)
  // eslint-disable-next-line
  log.map(info => console.log(info))
  // eslint-disable-next-line
  console.groupEnd()
}

export const responseLogger = (url, method, data) => {
  consoleGroup('RESPONSE: ', 'coral')(`${method.toUpperCase()}: ${url}`, data)
}

export const requestLogger = (url, method, params) => {
  consoleGroup('REQUEST: ', 'mediumpurple')(
    ...compact([`${toUpper(method)}: ${url}`, params]),
  )
}
