import { joinWith } from '../joinWith'

describe('joinWith', () => {
  it('joins only existing values with separator', () => {
    expect(joinWith('?', 'foo', null)).toBe('foo')
    expect(joinWith('?', 'foo', null, 'bar')).toBe('foo?bar')
  })
})
