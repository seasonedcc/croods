import kebabCase from 'lodash/kebabCase'
import { joinWith } from './joinWith'

import type { ActionOptions } from 'types'

const defaultUrlParser = kebabCase

const buildUrl = (options: ActionOptions): string => {
  const base = options.baseUrl?.replace(/(.+)\/+$/g, '$1')
  const { name, urlParser, id } = options
  const defaultPath = (urlParser || defaultUrlParser)(name || '')
  const pathWithId = joinWith('/', options.path || defaultPath, id)
  const customPath = id
    ? options.customPath?.replace(/(ˆ|\/)+(:id)+($|\/)/g, `/${id}/`) // replace ":id" with passed id
    : options.customPath
  const path = customPath || pathWithId
  return joinWith('/', base, path).replace(/([^https?:]\/)\/+/g, '$1') // remove extra "//" on urls
}

export { buildUrl }
