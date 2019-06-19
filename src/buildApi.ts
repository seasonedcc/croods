import axios from 'axios'
import { ActionOptions } from './typeDeclarations'

const defaultHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
}

export default async ({
  headers,
  baseUrl,
  requestTimeout,
  credentials,
}: ActionOptions) => {
  const customHeaders = await (typeof headers === 'function'
    ? headers(defaultHeaders)
    : headers)
  return axios.create({
    baseURL: baseUrl,
    timeout: requestTimeout,
    withCredentials: !!credentials,
    auth: credentials,
    headers: { ...defaultHeaders, ...customHeaders },
  })
}
