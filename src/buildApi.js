import axios from 'axios'
import * as pr from './persistHeaders'

const defaultHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
}

export default async ({
  persistHeaders,
  persistHeadersMethod,
  persistHeadersKey,
  headers,
  baseUrl,
  requestTimeout,
  credentials,
}) => {
  const persistedHeaders = persistHeaders
    ? await pr.getHeaders(
        persistHeadersMethod || localStorage,
        persistHeadersKey,
      )
    : {}
  const customHeaders = await (typeof headers === 'function'
    ? headers(defaultHeaders)
    : headers)
  return axios.create({
    baseURL: baseUrl,
    timeout: requestTimeout,
    withCredentials: !!credentials,
    credentials,
    headers: { ...defaultHeaders, ...persistedHeaders, ...customHeaders },
  })
}
