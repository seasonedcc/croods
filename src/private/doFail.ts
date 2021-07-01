import type { ActionOptions } from 'types'

const doFail = (
  options: ActionOptions,
  error: string,
  response: Response | null,
): string => {
  if (response?.status) {
    const { status, statusText } = response
    const is4xx = status >= 400 && status < 500
    const is5xx = status >= 500 && status < 600
    is4xx && options.after4xx?.(status, statusText)
    is5xx && options.after5xx?.(status, statusText)
  }

  response && options.handleResponseHeaders?.(response)
  options.afterFailure?.(response)
  response && options.afterResponse?.(response)
  return error
}

export { doFail }
