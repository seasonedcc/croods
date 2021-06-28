import kebabCase from 'lodash/kebabCase'
import { responseLogger } from '../logger'

import { doSuccess } from '../doSuccess'

const afterSuccess = jest.fn()
const afterResponse = jest.fn()

const config = { afterSuccess, afterResponse }

jest.mock('../logger', () => ({ responseLogger: jest.fn() }))

beforeEach(() => {
  responseLogger.mockClear()
})

const subject = (params, id) => doSuccess('/foo', 'GET', params || {}, id)

describe('doSuccess', () => {
  const parsers = ['Info', 'List', 'Fetch']
  describe('accepts custom parsers', () => {
    const response = { data: { message: ['foo', 'bar'] } }
    const parser = ({ data }) => data.message

    it('uses custom parser for requests without ID', () => {
      const result = subject({ parseInfoResponse: parser })(response, parsers)
      expect(result).toEqual({ message: ['foo', 'bar'] })

      const result2 = subject({ parseListResponse: parser })(response, parsers)
      expect(result2).toEqual(['foo', 'bar'])

      const result3 = subject({ parseFetchResponse: parser })(response, parsers)
      expect(result3).toEqual(['foo', 'bar'])
    })

    it('uses custom parser for requests with ID', () => {
      const result = subject({ parseInfoResponse: parser }, 10)(
        response,
        parsers,
      )
      expect(result).toEqual(['foo', 'bar'])

      const result2 = subject({ parseListResponse: parser }, 10)(
        response,
        parsers,
      )
      expect(result2).toEqual({ message: ['foo', 'bar'] })

      const result3 = subject({ parseFetchResponse: parser }, 10)(
        response,
        parsers,
      )
      expect(result3).toEqual(['foo', 'bar'])
    })
  })

  it('debugs the request if debugRequests was provided', () => {
    const response = { data: 'foo' }
    subject({ debugRequests: true })(response)
    expect(responseLogger).toHaveBeenCalledWith('/foo', 'GET', response)
  })

  it('does not debug if debugRequests was not provided', () => {
    const response = { data: 'foo' }
    subject(config)(response)
    expect(responseLogger).not.toHaveBeenCalled()
  })

  it('calls afterFailure', () => {
    const response = { data: ['foo', 'bar'] }
    subject(config)(response)
    expect(afterSuccess).toHaveBeenCalledWith(response)
    expect(afterSuccess).toHaveBeenCalledTimes(2)
  })

  it('calls afterResponse', () => {
    const response = { data: ['foo', 'bar'] }
    subject(config)(response)
    expect(afterResponse).toHaveBeenCalledWith(response)
    expect(afterResponse).toHaveBeenCalledTimes(3)
  })

  it('parses the response by default', () => {
    const response = { data: ['foo', 'bar'] }
    const result = subject()(response)
    expect(result).toEqual(['foo', 'bar'])
  })

  it('accepts a custom parser', () => {
    const response = { data: { message: ['foo', 'bar'] } }
    const parseResponse = ({ data }) => data.message
    const result = subject({ parseResponse })(response)
    expect(result).toEqual(['foo', 'bar'])
  })

  it('parses the returned parameters', () => {
    const response = { data: { first_name: 'John', last_name: 'Doe' } }
    const result = subject({})(response)
    expect(result).toEqual({ firstName: 'John', lastName: 'Doe' })
  })

  it('accepts a custom parameter parser', () => {
    const response = { data: { first_name: 'John', last_name: 'Doe' } }
    const result = subject({ paramsUnparser: kebabCase })(response)
    expect(result).toEqual({ 'first-name': 'John', 'last-name': 'Doe' })
  })
})
