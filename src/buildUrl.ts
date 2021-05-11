import kebabCase from 'lodash/kebabCase'
import joinWith from './joinWith'
import { ActionOptions, ID } from './typeDeclarations'

const defaultUrlParser = kebabCase

export default ({ name, urlParser, idToQueryString, path, customPath }: ActionOptions) => (
  id: ID,
): string => {
  if (!name) return '/'
  const defaultPath = (urlParser || defaultUrlParser)(name)
  const {separator, idForPath} = idToQueryString
    ? {separator: '?', idForPath: idToQueryString(id)}
    : {separator: '/', idForPath: id}
  const pathWithId = joinWith(separator, path || defaultPath, idForPath)
  const builtPath = customPath || pathWithId
  const parsedPath = id
    ? builtPath.replace(/(ˆ|\/)+(:id)+($|\/)/g, `/${id}/`) // replace ":id" with passed id
    : builtPath
  return parsedPath.replace(/([^https?:]\/)\/+/g, '$1') // remove extra "//" on urls
}
