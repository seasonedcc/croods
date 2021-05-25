// @ts-ignore
import createHumps from 'lodash-humps/lib/createHumps'
import camelCase from 'lodash/camelCase'
import get from 'lodash/get'
import identity from 'lodash/identity'
import type {
  ActionOptions,
  CroodsData,
  CroodsProviderOptions,
  HTTPMethod,
  ID,
  ServerResponseBody,
} from './typeDeclarations'

import { responseLogger } from './logger'

export type ParserWord =
  | 'Info'
  | 'List'
  | 'Fetch'
  | 'Update'
  | 'Create'
  | 'Save'
const defaultParamsUnparser = camelCase
const defaultParseResponse = ({ data }: ServerResponseBody) => data
const getParser = (word: ParserWord, config: Partial<CroodsProviderOptions>) =>
  get(config, `parse${word}Response`)

const doSuccess =
  (
    path: string,
    method: HTTPMethod,
    {
      debugRequests,
      afterSuccess,
      afterResponse,
      handleResponseHeaders,
      paramsUnparser,
      parseResponse,
      ...config
    }: ActionOptions,
    id?: ID,
  ) =>
  (response: ServerResponseBody, parsers: ParserWord[] = []): CroodsData => {
    const parser =
      (id ? getParser(parsers[0], config) : getParser(parsers[1], config)) ||
      getParser(parsers[2], config) ||
      parseResponse ||
      defaultParseResponse ||
      identity

    debugRequests && responseLogger(path, method, response)

    const unparseParams = createHumps(paramsUnparser || defaultParamsUnparser)
    const unparsedResponse = { ...response, data: unparseParams(response.data) }

    handleResponseHeaders && handleResponseHeaders(unparsedResponse)
    afterSuccess && afterSuccess(unparsedResponse)
    afterResponse && afterResponse(unparsedResponse)

    return parser(unparsedResponse)
  }

export default doSuccess
