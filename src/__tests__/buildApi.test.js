import axios from 'axios'

import buildApi from '../buildApi'

jest.mock('axios', () => ({
  create: jest.fn(() => 'foobar')
}))

const params = {
  headers: { foo: 'bar' },
  baseUrl: 'https://api.foobar.com',
  requestTimeout: 30,
  credentials: 'foobar-credentials',
}

describe('when header is a function', () => {
  it('calls header', async () => {
    const headers = jest.fn(() => ({ foo: 'bar' }))
    await buildApi({ ...params, headers, })

    expect(headers).toHaveBeenCalled()
  })
})

it('calls axios.create', async () => {
  await buildApi(params)

  expect(axios.create).toHaveBeenCalledWith(
    {
      baseURL: params.baseUrl,
      timeout: params.requestTimeout,
      withCredentials: true,
      auth: params.credentials,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        foo: 'bar'
      }
    }
  )
})
