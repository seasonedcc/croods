import kebabCase from 'lodash/kebabCase'
import { joinWith } from './joinWith'

import type { ActionOptions, ID } from 'types'

const defaultUrlParser = kebabCase

const buildUrl =
  ({ name, urlParser, path, customPath }: ActionOptions) =>
  (id?: ID): string => {
    if (!name) return '/'
    const defaultPath = (urlParser || defaultUrlParser)(name)
    const pathWithId = joinWith('/', path || defaultPath, id)
    const builtPath = customPath || pathWithId
    const parsedPath = id
      ? builtPath.replace(/(ˆ|\/)+(:id)+($|\/)/g, `/${id}/`) // replace ":id" with passed id
      : builtPath
    return parsedPath.replace(/([^https?:]\/)\/+/g, '$1') // remove extra "//" on urls
  }

export { buildUrl }
