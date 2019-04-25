import kebabCase from 'lodash/kebabCase'

const defaultUrlParser = kebabCase

export default ({ name, urlParser, path }) => id => {
  const defaultPath = `/${(urlParser || defaultUrlParser)(name)}`
  const string = path || (id ? `${defaultPath}/${id}` : defaultPath)
  return string.replace(/([^https?:]\/)\/+/g, '$1')
}
