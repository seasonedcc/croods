import { findStatePiece } from '../findStatePiece'

describe('findStatePiece', () => {
  it('returns initialState if part of state is not found', () => {
    expect(findStatePiece({}, 'colors')).toMatchObject({
      info: null,
      list: [],
    })
  })

  it('accepts stateId', () => {
    expect(
      findStatePiece({ 'colors@foo': { foo: 'bar' } }, 'colors', 'foo'),
    ).toMatchObject({ foo: 'bar' })
  })
})
