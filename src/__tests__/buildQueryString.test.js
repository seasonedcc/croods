import kebabCase from 'lodash/kebabCase'
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

  it('accepts a queryString parser', () => {
    expect(
      buildQueryString(
        { camelCase: 'should-be-kebab' },
        { queryStringParser: kebabCase },
      ),
    ).toBe('camel-case=should-be-kebab')
  })

  it('filters nill and NaN values from queryString', () => {
    expect(
      buildQueryString({
        nan: NaN,
        null: null,
        undefined: undefined,
        zero: 0,
        false: false,
        value: 'foobar',
      }),
    ).toBe('zero=0&false=false&value=foobar')
  })
})
