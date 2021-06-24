import snakeCase from 'lodash/snakeCase'
import { buildUrl } from '../buildUrl'

describe('buildUrl', () => {
  describe('when no custom path is provided', () => {
    it('parses the URL based on name, defaults to kebabCase', () => {
      const result = buildUrl({ name: 'somePath' })()
      expect(result).toBe('some-path')
    })

    it('accepts a URL parser', () => {
      const result = buildUrl({ name: 'somePath', urlParser: snakeCase })()
      expect(result).toBe('some_path')
    })

    it('appends the ID to the end of generated path', () => {
      const result = buildUrl({ name: 'somePath' })(10)
      expect(result).toBe('some-path/10')
    })
  })

  describe('when path is provided', () => {
    it('uses the path instead of name', () => {
      const result = buildUrl({ name: 'somePath', path: 'foo/bar' })()
      expect(result).toBe('foo/bar')
    })

    it('appends the ID to the end of given path', () => {
      const result = buildUrl({ name: 'somePath', path: 'foo/bar' })(10)
      expect(result).toBe('foo/bar/10')
    })

    // TODO: expected result below will break the API
    // it('does not accept a wildcard', () => {
    //   const result = buildUrl({ name: 'foo', customPath: 'foo/:id/bar' })(10)
    //   expect(result).toBe('foo/10/bar')
    // })
  })

  describe('when customPath is provided', () => {
    it('does not append the ID to the end of customPath', () => {
      const result = buildUrl({ name: 'foo', customPath: 'fizz/buzz' })(10)
      expect(result).toBe('fizz/buzz')
    })

    it('has precedence over path', () => {
      const result = buildUrl({
        name: 'foo',
        path: 'foo/bar',
        customPath: 'fizz/buzz',
      })()
      expect(result).toBe('fizz/buzz')
    })

    it('accepts a wildcard to place the :id', () => {
      const result = buildUrl({ name: 'foo', customPath: 'foo/:id/bar' })(10)
      expect(result).toBe('foo/10/bar')
    })

    it('does not replace :id wildcard if no id was given', () => {
      const result = buildUrl({ name: 'foo', customPath: 'foo/:id/bar' })()
      expect(result).toBe('foo/:id/bar')
    })
  })

  describe('other utilities', () => {
    it('removes extra slashes', () => {
      const result = buildUrl({ name: 'foo', path: '/foo//bar//' })()
      expect(result).toBe('/foo/bar/')
    })

    it('returns / if name was not given', () => {
      const result = buildUrl({ customPath: 'foo/:id/bar' })()
      expect(result).toBe('/')
    })
  })
})
