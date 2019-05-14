import kebabCase from 'lodash/kebabCase'
import joinWith from './joinWith'

const defaultUrlParser = kebabCase

export default ({ name, urlParser, path, customPath }) => id => {
  const defaultPath = (urlParser || defaultUrlParser)(name)
  const pathWithId = joinWith('/', path || defaultPath, id)
  const builtPath = customPath || pathWithId
  const parsedPath = id
    ? builtPath.replace(/(ˆ|\/)+(:id)+($|\/)/g, `/${id}/`) // replace ":id" with passed id
    : builtPath
  return parsedPath.replace(/([^https?:]\/)\/+/g, '$1') // remove extra "//" on urls
}
