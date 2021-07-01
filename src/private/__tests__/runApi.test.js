import { runApi } from '../runApi'
import kebabCase from 'lodash/kebabCase'

const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
}
const dummyMock = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  }),
)

beforeEach(jest.clearAllMocks)

const buildRequest = (config, kind = 'fetch') => ({
  options: { baseUrl: 'https://api.foobar.com/', name: 'colors', ...config },
  requestType: { kind },
})
const buildExpect = (method = 'GET', path = '', options = {}) => [
  `https://api.foobar.com/${path}`,
  {
    ...options,
    headers: { ...headers, ...options.headers },
    method,
  },
]

const withFetchMock = fetchMock => async fn => {
  const oldFetch = global.fetch
  global.fetch = fetchMock
  const result = await fn()
  global.fetch = oldFetch
  return result
}

describe('when request is a simple GET', () => {
  it('configures and calls fetch on baseUrl', async () => {
    const request = buildRequest({ name: undefined })
    await withFetchMock(dummyMock)(async () => {
      const r = await runApi(request)
      await r()
    })

    expect(dummyMock).toHaveBeenCalledWith(
      'https://api.foobar.com',
      buildExpect()[1],
    )
  })

  it('configures and calls fetch on an endpoint', async () => {
    const request = buildRequest()
    await withFetchMock(dummyMock)(async () => {
      const r = await runApi(request)
      await r()
    })

    expect(dummyMock).toHaveBeenCalledWith(...buildExpect('GET', 'colors'))
  })

  it('configures and calls fetch with a queryString', async () => {
    const request = buildRequest({ query: { page: 2 } })
    await withFetchMock(dummyMock)(async () => {
      const r = await runApi(request)
      await r()
    })

    expect(dummyMock).toHaveBeenCalledWith(
      ...buildExpect('GET', 'colors?page=2'),
    )
  })

  it('configures and calls fetch with a custom method', async () => {
    const request = buildRequest({ method: 'HEAD' })
    await withFetchMock(dummyMock)(async () => {
      const r = await runApi(request)
      await r()
    })

    expect(dummyMock).toHaveBeenCalledWith(...buildExpect('HEAD', 'colors'))
  })

  it('configures and calls save', async () => {
    const request = buildRequest({}, 'save')
    await withFetchMock(dummyMock)(async () => {
      const r = await runApi(request)
      await r()
    })

    expect(dummyMock).toHaveBeenCalledWith(...buildExpect('POST', 'colors'))
  })

  it('configures and calls save with a PUT method when dealing with ID', async () => {
    const request = buildRequest({ id: 1 }, 'save')
    await withFetchMock(dummyMock)(async () => {
      const r = await runApi(request)
      await r()
    })

    expect(dummyMock).toHaveBeenCalledWith(...buildExpect('PUT', 'colors/1'))
  })

  it('configures and calls save with a custom method even when dealing with ID', async () => {
    const request = buildRequest({ id: 1, method: 'POST' }, 'save')
    await withFetchMock(dummyMock)(async () => {
      const r = await runApi(request)
      await r()
    })

    expect(dummyMock).toHaveBeenCalledWith(...buildExpect('POST', 'colors/1'))
  })

  it('configures and calls destroy', async () => {
    const request = buildRequest({ id: 1 }, 'destroy')
    await withFetchMock(dummyMock)(async () => {
      const r = await runApi(request)
      await r()
    })

    expect(dummyMock).toHaveBeenCalledWith(...buildExpect('DELETE', 'colors/1'))
  })

  it('accepts a customPath with wildcard to replace with ID', async () => {
    const request = buildRequest({ id: 1, customPath: '/foo/:id/bar' })
    await withFetchMock(dummyMock)(async () => {
      const r = await runApi(request)
      await r()
    })

    expect(dummyMock).toHaveBeenCalledWith(...buildExpect('GET', 'foo/1/bar'))
  })

  it('accepts a hardcoded path and appends the ID', async () => {
    const request = buildRequest({ id: 1, path: '/foo/bar' })
    await withFetchMock(dummyMock)(async () => {
      const r = await runApi(request)
      await r()
    })

    expect(dummyMock).toHaveBeenCalledWith(...buildExpect('GET', 'foo/bar/1'))
  })

  it('sends the body stringified in the request', async () => {
    const request = buildRequest({}, 'save')
    const body = { firstName: 'John', lastName: 'Doe' }
    await withFetchMock(dummyMock)(async () => {
      const r = await runApi(request)
      await r(body)
    })

    expect(dummyMock).toHaveBeenCalledWith(
      ...buildExpect('POST', 'colors', {
        body: '{"first_name":"John","last_name":"Doe"}',
      }),
    )
  })

  it('accepts a paramParser for sending request according to backend expectations', async () => {
    const request = buildRequest({ paramsParser: kebabCase })
    const body = { firstName: 'John' }
    await withFetchMock(dummyMock)(async () => {
      const r = await runApi(request)
      await r(body)
    })

    expect(dummyMock).toHaveBeenCalledWith(
      ...buildExpect('GET', 'colors', {
        body: '{"first-name":"John"}',
      }),
    )
  })
})
