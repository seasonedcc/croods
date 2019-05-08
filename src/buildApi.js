import axios from 'axios'

const defaultHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
}

export default async ({ headers, baseUrl, requestTimeout, credentials }) => {
  const customHeaders = await (typeof headers === 'function'
    ? headers(defaultHeaders)
    : headers)
  return axios.create({
    baseURL: baseUrl,
    timeout: requestTimeout,
    withCredentials: !!credentials,
    credentials,
    headers: { ...defaultHeaders, ...customHeaders },
  })
}
