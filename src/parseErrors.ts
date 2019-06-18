import get from 'lodash/get'
import joinWith from './joinWith'

export default error => {
  if (error.response) {
    return (
      get(error.response, 'data.message') ||
      get(error.response, 'data.errors.0') ||
      get(error.response, 'data.errors.full_messages.0') ||
      get(error.response, 'data.error') ||
      joinWith(
        ' - ',
        get(error.response, 'status'),
        get(error.response, 'statusMessage'),
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
  return error.message
}
