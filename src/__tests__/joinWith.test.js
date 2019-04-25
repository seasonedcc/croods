import joinWith from '../joinWith'

describe('joinWith', () => {
  it('joins only existing values with mark', () => {
    expect(joinWith('?', 'foo', null)).toBe('foo')
    expect(joinWith('?', 'foo', null, 'bar')).toBe('foo?bar')
  })
})
