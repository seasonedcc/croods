const consoleGroup = (title, color) => (...log) => {
  console.group(`%c${title}`, `color: ${color};`)
  log.map(info => console.log(info))
  console.groupEnd()
}

export default (url, fetchParams) => {
  const { method, ...params } = fetchParams
  consoleGroup('REQUEST: ', 'mediumpurple')(
    `${method.toUpperCase()}: ${url}`,
    params,
  )
}
