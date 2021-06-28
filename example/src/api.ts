export default {
  name: 'users',
  debugRequests: false,
  baseUrl: 'https://jsonplaceholder.typicode.com' as const,
  parseFetchResponse: ({ data }: Record<string, any>): any => data,
}
