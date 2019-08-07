import doFail from '../doFail'
import { responseLogger } from '../logger'

jest.mock('../logger', () => ({ responseLogger: jest.fn() }))

const after4xx = jest.fn()
const after5xx = jest.fn()
const afterFailure = jest.fn()
const afterResponse = jest.fn()

const config = { after4xx, after5xx, afterFailure, afterResponse }

beforeEach(() => {
  after4xx.mockClear()
  after5xx.mockClear()
  responseLogger.mockClear()
})

describe('doFail', () => {
  it('debugs the error if debugRequests was provided', () => {
    doFail('/foo', 'GET', { debugRequests: true })({ message: 'Not found' })
    expect(responseLogger).toHaveBeenCalledWith('/foo', 'GET', {
      message: 'Not found',
    })
  })

  it('does not debug if debugRequests was not provided', () => {
    doFail('/foo', 'GET', {})({ message: 'Not found' })
    expect(responseLogger).not.toHaveBeenCalled()
  })

  it('calls after4xx with status and message', () => {
    const error = {
      response: { status: 404, statusMessage: 'Not found', data: 'foo' },
    }
    doFail('/foo', 'GET', config)(error)
    expect(after4xx).toHaveBeenCalledWith(404, 'Not found', 'foo')
    expect(after5xx).not.toHaveBeenCalled()
  })

  it('calls after5xx with status and message', () => {
    const error = {
      response: { status: 503, statusMessage: 'Unavailable' },
    }
    doFail('/foo', 'GET', config)(error)
    expect(after4xx).not.toHaveBeenCalled()
    expect(after5xx).toHaveBeenCalledWith(503, 'Unavailable', undefined)
  })

  it('calls afterFailure', () => {
    const error = {
      response: { status: 503, statusMessage: 'Unavailable' },
    }
    doFail('/foo', 'GET', config)(error)
    expect(afterFailure).toHaveBeenCalledWith(error)
    expect(afterFailure).toHaveBeenCalledTimes(3)
  })

  it('calls afterResponse', () => {
    const error = {
      response: { status: 404, statusMessage: 'Unavailable' },
    }
    doFail('/foo', 'GET', config)(error)
    expect(afterResponse).toHaveBeenCalledWith(error.response)
    expect(afterResponse).toHaveBeenCalledTimes(4)
  })

  it('returs the parsed error', () => {
    const error = {
      response: { status: 404, statusMessage: 'Unavailable' },
    }
    const result = doFail('/foo', 'GET', {})(error)
    expect(result).toBe('404 - Unavailable')
  })

  it('accepts a custom error parser', () => {
    const error = {
      response: { status: 404, statusMessage: 'Unavailable' },
    }
    const parseErrors = (fullError, parsedError) =>
      `My custom error for ${fullError.response.status}, followed by the default error: ${parsedError}`

    const result = doFail('/foo', 'GET', { parseErrors })(error)
    expect(result).toBe(
      'My custom error for 404, followed by the default error: 404 - Unavailable',
    )
  })
})
