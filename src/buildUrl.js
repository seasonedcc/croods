import kebabCase from 'lodash/kebabCase'

const defaultUrlParser = kebabCase

export default ({ name, urlParser, path }) => id => {
  const defaultPath = `/${(urlParser || defaultUrlParser)(name)}`
  const defaultString = path || (id ? `${defaultPath}/${id}` : defaultPath)
  const string = path && id ? `${path}/${id}` : defaultString
  return string.replace(/([^https?:]\/)\/+/g, '$1')
}
