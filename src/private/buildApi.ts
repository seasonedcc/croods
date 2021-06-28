import axios from 'axios'

import type { AxiosInstance } from 'axios'
import type { ActionOptions, HeadersObj } from 'types'

const defaultHeaders: HeadersObj = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
}

const buildApi = async ({
  headers,
  baseUrl,
  requestTimeout,
  credentials,
}: ActionOptions): Promise<AxiosInstance> => {
  const customHeaders = await (typeof headers === 'function'
    ? headers(defaultHeaders)
    : headers)
  return axios.create({
    baseURL: baseUrl,
    timeout: requestTimeout,
    withCredentials: Boolean(credentials),
    auth: credentials,
    headers: { ...defaultHeaders, ...customHeaders } as HeadersObj,
  })
}

export { buildApi }
