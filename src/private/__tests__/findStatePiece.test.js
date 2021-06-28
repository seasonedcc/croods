import { initialState } from '../initialState'

import { findStatePiece, getStateKey } from '../findStatePiece'

describe('findStatePiece', () => {
  const state = {
    'colors@foo': { foo: 'bar' },
    colors: { fizz: 'buzz' },
    users: { list: [] },
  }

  it('returns initialState if part of state is not found', () => {
    expect(findStatePiece({}, 'colors')).toMatchObject(initialState)
  })

  it('finds piece of state by name', () => {
    expect(findStatePiece(state, 'colors')).toMatchObject({ fizz: 'buzz' })
  })

  it('finds piece of state by name and stateId', () => {
    expect(findStatePiece(state, 'colors', 'foo')).toMatchObject({ foo: 'bar' })
  })
})

describe('getStateKey', () => {
  it('returns the name and stateId concat in a string', () => {
    expect(getStateKey('name', 'id')).toBe('name@id')
  })

  it('returns only name if no stateId was provided', () => {
    expect(getStateKey('name')).toBe('name')
  })
})
