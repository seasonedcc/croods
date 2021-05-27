import { responseLogger } from './logger'
import defaultParseErrors from './parseErrors'
import type { ActionOptions, HTTPMethod, ServerError } from './typeDeclarations'

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
  (error: ServerError): string => {
    console.log(error.response)
    debugRequests && responseLogger(path, method, error.response)

    if (error.response && error.response.status) {
      const { status, statusText, data } = error.response
      const is4xx = status >= 400 && status < 500
      const is5xx = status >= 500 && status < 600
      is4xx && after4xx && after4xx(status, statusText, data)
      is5xx && after5xx && after5xx(status, statusText, data)
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
