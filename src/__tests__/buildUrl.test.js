import snakeCase from 'lodash/snakeCase'
import buildUrl from '../buildUrl'

describe('buildUrl', () => {
  it('parses the URL based on name', () => {
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

  it('appends the ID to the end of given path', () => {
    const result = buildUrl({ name: 'somePath', path: 'foo/bar' })(10)
    expect(result).toBe('foo/bar/10')
  })

  it('does not append the ID to the end of customPath', () => {
    const result = buildUrl({ customPath: 'fizz/buzz' })(10)
    expect(result).toBe('fizz/buzz')
  })

  it('uses path over generated path', () => {
    const result = buildUrl({ name: 'foo', path: 'foo/bar' })()
    expect(result).toBe('foo/bar')
  })

  it('uses customPath over path', () => {
    const result = buildUrl({ path: 'foo/bar', customPath: 'fizz/buzz' })()
    expect(result).toBe('fizz/buzz')
  })

  it('removes extra slashes', () => {
    const result = buildUrl({ path: '/foo////bar//' })()
    expect(result).toBe('/foo/bar/')
  })

  it('replaces :id', () => {
    const result = buildUrl({ customPath: 'foo/:id/bar' })(10)
    expect(result).toBe('foo/10/bar')

    const result2 = buildUrl({ path: 'foo/:id/bar' })(10)
    expect(result2).toBe('foo/10/bar/10')
  })

  it('does not replace :id if id was not given', () => {
    const result = buildUrl({ customPath: 'foo/:id/bar' })()
    expect(result).toBe('foo/:id/bar')
  })
})
