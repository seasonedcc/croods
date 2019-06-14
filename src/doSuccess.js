import createHumps from 'lodash-humps/lib/createHumps'
import camelCase from 'lodash/camelCase'
import get from 'lodash/get'
import identity from 'lodash/identity'

import { responseLogger } from './logger'

const defaultUnparseParams = camelCase
const defaultParseResponse = ({ data }) => data
const getParser = (word, config) => get(config, `parse${word}Response`)

export default (
  path,
  method,
  {
    debugRequests,
    afterHeaders,
    afterSuccess,
    afterResponse,
    handleResponseHeaders,
    unparseParams,
    parseResponse,
    ...config
  },
  id,
) => (response, parsers = []) => {
  const parser =
    (id ? getParser(parsers[0], config) : getParser(parsers[1], config)) ||
    getParser(parsers[2], config) ||
    parseResponse ||
    defaultParseResponse ||
    identity

  debugRequests && responseLogger(path, method, response)

  const paramsUnparser = createHumps(unparseParams || defaultUnparseParams)
  const unparsedResponse = { ...response, data: paramsUnparser(response.data) }

  const headersCb = handleResponseHeaders || afterHeaders
  headersCb && headersCb(unparsedResponse)
  afterSuccess && afterSuccess(unparsedResponse)
  afterResponse && afterResponse(unparsedResponse)

  return parser(unparsedResponse)
}
