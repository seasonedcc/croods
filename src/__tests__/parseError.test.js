import parseError from '../parseError'

describe('parseError', () => {
  it('returns the response message if it is found', () => {
    const error1 = parseError({
      response: { data: { message: 'Could not find' } },
    })
    expect(error1).toBe('Could not find')

    const error2 = parseError({
      response: { data: { errors: ['First', 'Other'] } },
    })
    expect(error2).toBe('First')

    const error3 = parseError({
      response: {
        data: { errors: { full_messages: ['First full', 'Other'] } },
      },
    })
    expect(error3).toBe('First full')

    const error4 = parseError({
      response: { data: { error: 'Another error' } },
    })
    expect(error4).toBe('Another error')

    const error5 = parseError({ response: { status: 404 } })
    expect(error5).toBe('404')

    const error6 = parseError({
      response: { status: 404, statusMessage: 'Not found' },
    })
    expect(error6).toBe('404 - Not found')
  })

  it('returns the request if no response is found', () => {
    const error1 = parseError({ request: { responseText: 'Weird bug' } })
    expect(error1).toBe('Weird bug')

    const error2 = parseError({
      request: { status: 500, statusText: 'Internal Error' },
    })
    expect(error2).toBe('500 - Internal Error')

    const error3 = parseError({
      request: { status: 500 },
    })
    expect(error3).toBe('500')
  })

  it('returns the message if no response or request is found', () => {
    const result = parseError(new Error('Network Error'))
    expect(result).toBe('Network Error')
  })
})
