import { responseLogger } from './logger'

export default (
  path,
  method,
  { afterFailure, afterResponse, debugRequests },
) => error => {
  debugRequests && responseLogger(path, method, error)

  afterFailure && afterFailure(error)
  afterResponse && afterResponse(error)

  return false
}
