import kebabCase from 'lodash/kebabCase'

const defaultUrlParser = kebabCase

export default ({ name, urlParser, path, customPath }) => id => {
  const defaultPath = `/${(urlParser || defaultUrlParser)(name)}`
  const defaultString = path || (id ? `${defaultPath}/${id}` : defaultPath)
  const builtPath = path && id ? `${path}/${id}` : defaultString
  const string = customPath || builtPath
  return string
    .replace(/(ˆ|\/)+(:id)+($|\/)/g, `/${id}/`) // replace ":id" with passed id
    .replace(/([^https?:]\/)\/+/g, '$1') // remove extra "//" on urls
}
