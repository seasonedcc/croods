import parseErrors from '../parseErrors'

describe('parseErrors', () => {
  it('returns the response message if it is found', () => {
    const error1 = parseErrors({
      response: { data: { message: 'Could not find' } },
    })
    expect(error1).toBe('Could not find')

    const error2 = parseErrors({
      response: { data: { errors: ['First', 'Other'] } },
    })
    expect(error2).toBe('First')

    const error3 = parseErrors({
      response: {
        data: { errors: { full_messages: ['First full', 'Other'] } },
      },
    })
    expect(error3).toBe('First full')

    const error4 = parseErrors({
      response: { data: { error: 'Another error' } },
    })
    expect(error4).toBe('Another error')

    const error5 = parseErrors({ response: { status: 404 } })
    expect(error5).toBe('404')

    const error6 = parseErrors({
      response: { status: 404, statusMessage: 'Not found' },
    })
    expect(error6).toBe('404 - Not found')
  })

  it('returns the request if no response is found', () => {
    const error1 = parseErrors({ request: { responseText: 'Weird bug' } })
    expect(error1).toBe('Weird bug')

    const error2 = parseErrors({
      request: { status: 500, statusText: 'Internal Error' },
    })
    expect(error2).toBe('500 - Internal Error')

    const error3 = parseErrors({
      request: { status: 500 },
    })
    expect(error3).toBe('500')
  })

  it('returns the message if no response or request is found', () => {
    const result = parseErrors(new Error('Network Error'))
    expect(result).toBe('Network Error')
  })
})
