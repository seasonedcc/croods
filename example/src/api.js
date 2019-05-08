export default {
  name: 'users',
  debugRequests: false,
  baseUrl: 'https://jsonplaceholder.typicode.com',
  parseFetchResponse: ({ data }) => data,
}
