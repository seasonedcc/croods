import identity from 'lodash/identity'
import isArray from 'lodash/isArray'
import isEmpty from 'lodash/isEmpty'
import isNil from 'lodash/isNil'
import isNaN from 'lodash/isNaN'
import map from 'lodash/map'
import omitBy from 'lodash/omitBy'

import type { ActionOptions } from 'types'

const buildQueryString = (options: ActionOptions): null | string => {
  if (isEmpty(options.query)) return null
  const parser = options?.queryStringParser || identity
  const filteredQuery = omitBy(options.query, val => isNaN(val) || isNil(val))
  const queryString = map(filteredQuery, (value, key) =>
    isArray(value)
      ? map(value, v => `${parser(key)}[]=${v}`).join('&')
      : `${parser(key)}=${value}`,
  )
  return queryString.join('&')
}

export { buildQueryString }
