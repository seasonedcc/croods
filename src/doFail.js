import { responseLogger } from './logger'

export default (
  path,
  method,
  { afterFailure, afterResponse, debugRequests },
) => async error => {
  debugRequests && responseLogger(path, method, error)

  afterFailure && (await afterFailure(error))
  afterResponse && (await afterResponse(error))

  return false
}
