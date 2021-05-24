import identity from 'lodash/identity'
import isArray from 'lodash/isArray'
import isEmpty from 'lodash/isEmpty'
import isNil from 'lodash/isNil'
import isNaN from 'lodash/isNaN'
import map from 'lodash/map'
import omitBy from 'lodash/omitBy'
import type { QueryStringObj } from './typeDeclarations'

type buildQSOptions = {
  queryStringParser?(t: string): string
}
export default (
  query?: QueryStringObj,
  options?: buildQSOptions,
): null | string => {
  if (isEmpty(query)) return null
  const parser = options?.queryStringParser || identity
  const filteredQuery = omitBy(query, val => isNaN(val) || isNil(val))
  const queryString = map(filteredQuery, (value, key) =>
    isArray(value)
      ? map(value, v => `${parser(key)}[]=${v}`).join('&')
      : `${parser(key)}=${value}`,
  )
  return queryString.join('&')
}
