import { responseLogger } from './logger'
import defaultParseErrors from './parseErrors'
import type {
  ActionOptions,
  HTTPMethod,
  ServerResponse,
} from './typeDeclarations'

const doFail =
  (
    path: string,
    method: HTTPMethod,
    {
      after4xx,
      after5xx,
      afterFailure,
      afterResponse,
      debugRequests,
      handleResponseHeaders,
      parseErrors,
    }: ActionOptions,
  ) =>
  (error: ServerResponse) => {
    debugRequests && responseLogger(path, method, error)

    if (error.response && error.response.status) {
      const { status, statusMessage, data } = error.response
      const is4xx = status >= 400 && status < 500
      const is5xx = status >= 500 && status < 600
      is4xx && after4xx && after4xx(status, statusMessage, data)
      is5xx && after5xx && after5xx(status, statusMessage, data)
    }

    error.response &&
      handleResponseHeaders &&
      handleResponseHeaders(error.response)
    afterFailure && afterFailure(error)
    error.response && afterResponse && afterResponse(error.response)

    const parsedError = defaultParseErrors(error)

    return parseErrors ? parseErrors(error, parsedError) : parsedError
  }

export default doFail
