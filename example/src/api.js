export default {
  name: 'users',
  debugRequests: false,
  persistHeaders: true,
  baseUrl: 'https://jsonplaceholder.typicode.com',
  parseFetchResponse: ({ data }) => data,
}
