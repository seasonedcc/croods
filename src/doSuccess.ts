// @ts-ignore
import createHumps from 'lodash-humps/lib/createHumps'
import camelCase from 'lodash/camelCase'
import get from 'lodash/get'
import identity from 'lodash/identity'
import { ActionOptions, ProviderOptions, ID } from './typeDeclarations'

import { responseLogger } from './logger'
import { AxiosResponse } from 'axios'

const defaultParamsUnparser = camelCase
const defaultParseResponse = ({ data }: AxiosResponse) => data
const getParser = (word: string, config: Partial<ProviderOptions>) =>
  get(config, `parse${word}Response`)

export default (
    path: string,
    method: string,
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
  (response: AxiosResponse, parsers: string[] = []) => {
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
