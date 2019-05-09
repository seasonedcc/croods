import createHumps from 'lodash-humps/lib/createHumps'
import camelCase from 'lodash/camelCase'
import identity from 'lodash/identity'

import { responseLogger } from './logger'

const defaultUnparseParams = camelCase

export default (
  path,
  method,
  { debugRequests, afterSuccess, afterResponse, unparseParams },
) => (response, parser = identity) => {
  debugRequests && responseLogger(path, method, response)

  afterSuccess && afterSuccess(response)
  afterResponse && afterResponse(response)

  const paramsUnparser = createHumps(unparseParams || defaultUnparseParams)
  return paramsUnparser(parser(response))
}
