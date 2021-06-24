import kebabCase from 'lodash/kebabCase'
import { buildQueryString } from '../buildQueryString'

describe('buildQueryString', () => {
  describe('when there is no query', () => {
    it('returns null', () => {
      expect(buildQueryString()).toBe(null)
      expect(buildQueryString({})).toBe(null)
    })
  })

  describe('when query is given', () => {
    it('returns a formatted queryString', () => {
      expect(buildQueryString({ foo: 'bar', another: 'value' })).toBe(
        'foo=bar&another=value',
      )
    })

    it('formats arrays in the query string', () => {
      expect(buildQueryString({ tags: ['foo', 'bar'], another: 'value' })).toBe(
        'tags[]=foo&tags[]=bar&another=value',
      )
    })

    it('accepts a custom queryString parser', () => {
      expect(
        buildQueryString(
          { camelCase: 'should-be-kebab' },
          { queryStringParser: kebabCase },
        ),
      ).toBe('camel-case=should-be-kebab')
    })

    it('filters "nil" and NaN values from queryString', () => {
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
})
