// @ts-ignore
import createHumps from 'lodash-humps/lib/createHumps'
import camelCase from 'lodash/camelCase'
import identity from 'lodash/identity'
import { attempt } from './utils'

import type { CroodsData } from 'types'
import type { Request } from './runApi'

const doSuccess = async (
  request: Request,
  response: Response,
): Promise<CroodsData> => {
  const { options, requestType } = request
  const { id, paramsUnparser, parseResponse = identity } = options
  const [, json] = await attempt(() => response.json())
  const fetchParser =
    (id ? options.parseInfoResponse : options.parseListResponse) ||
    options.parseFetchResponse
  const saveParser =
    (id ? options.parseUpdateResponse : options.parseCreateResponse) ||
    options.parseSaveResponse
  const parser =
    (requestType.kind === 'fetch' && fetchParser) ||
    (requestType.kind === 'save' && saveParser) ||
    parseResponse

  const unparseParams = createHumps(paramsUnparser || camelCase)
  const unparsedResponse = unparseParams(json)

  options.handleResponseHeaders?.(unparsedResponse)
  options.afterSuccess?.(unparsedResponse)
  options.afterResponse?.(unparsedResponse)

  return parser(unparsedResponse)
}

export { doSuccess }
