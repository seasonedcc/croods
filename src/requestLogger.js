export const consoleGroup = (title, color) => (...log) => {
  // eslint-disable-next-line
  console.group(`%c${title}`, `color: ${color};`)
  // eslint-disable-next-line
  log.map(info => console.log(info))
  // eslint-disable-next-line
  console.groupEnd()
}

export default (url, fetchParams) => {
  const { method, ...params } = fetchParams
  consoleGroup('REQUEST: ', 'mediumpurple')(
    `${method.toUpperCase()}: ${url}`,
    params,
  )
}
