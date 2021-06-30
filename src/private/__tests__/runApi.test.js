import { runApi } from '../runApi'

const dummyMock = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ rates: { CAD: 1.42 } }),
  })
)

const withFetchMock = (fetchMock) => async (fn) => {
  const oldFetch = global.fetch
  global.fetch = fetchMock
  const result = await fn()
  global.fetch = oldFetch
  return result
}

describe('when request is a simple GET', () => {
  it('configures and calls fetch', async () => {
    const request = {
      options: {
        headers: { foo: 'bar' },
        baseUrl: 'https://api.foobar.com',
      }
    }

    await withFetchMock(dummyMock)(async () => {
      const r = await runApi(request)
      await r()
    })

    expect(dummyMock).toHaveBeenCalledWith('https://api.foobar.com', { headers: { foo: 'bar' } })
  })
})
