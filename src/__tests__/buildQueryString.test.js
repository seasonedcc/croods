import buildQueryString from '../buildQueryString'

describe('buildQueryString', () => {
  it('returns an empty string if there is no query', () => {
    expect(buildQueryString()).toBe(null)
    expect(buildQueryString({})).toBe(null)
  })

  it('returns a formatted query string if an object is given', () => {
    expect(buildQueryString({ foo: 'bar', another: 'value' })).toBe(
      'foo=bar&another=value',
    )
  })

  it('formats array in query string', () => {
    expect(buildQueryString({ tags: ['foo', 'bar'], another: 'value' })).toBe(
      'tags[]=foo&tags[]=bar&another=value',
    )
  })
})
