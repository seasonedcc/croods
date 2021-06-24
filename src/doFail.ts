import get from 'lodash/get'
import { joinWith } from './joinWith'
import { Method } from 'axios'
import { responseLogger } from './logger'
import type { ActionOptions, ServerError } from './types'

const defaultParseErrors = (error: ServerError): string => {
  if (error.response) {
    return (
      get(error.response, 'data.message') ||
      get(error.response, 'data.errors.0') ||
      get(error.response, 'data.errors.full_messages.0') ||
      get(error.response, 'data.error') ||
      joinWith(
        ' - ',
        get(error.response, 'status'),
        get(error.response, 'statusText'),
      )
    )
  }
  if (get(error.request, 'responseText') || get(error.request, 'status')) {
    return (
      get(error.request, 'responseText') ||
      joinWith(' - ', error.request.status, error.request.statusText)
    )
  }
  // Something happened in setting up the request that triggered an Error
  return error.message || 'Unknown error'
}

const doFail =
  (
    path: string,
    method: Method,
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

export { doFail, defaultParseErrors }
