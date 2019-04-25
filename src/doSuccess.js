import createHumps from 'lodash-humps/lib/createHumps'
import camelCase from 'lodash/camelCase'
import identity from 'lodash/identity'

import saveHeaders from './saveHeaders'
import { responseLogger } from './logger'

const defaultUnparseParams = camelCase

export default (
  path,
  method,
  { debugRequests, afterSuccess, afterResponse, unparseParams, ...options },
) => async (response, parser = identity) => {
  debugRequests && responseLogger(path, method, response)

  saveHeaders(options)(response)
  afterSuccess && (await afterSuccess(response))
  afterResponse && (await afterResponse(response))

  const paramsUnparser = createHumps(unparseParams || defaultUnparseParams)
  return paramsUnparser(parser(response))
}
