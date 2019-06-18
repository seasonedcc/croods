import { fetchMap, addToItem, stateMiddleware } from '../actionHelpers'
import initialState from '../initialState'
import { consoleGroup } from '../logger'

afterEach(jest.clearAllMocks)

jest.mock('../logger', () => ({
  consoleGroup: jest.fn(() => jest.fn()),
}))

describe('stateMiddleWare', () => {
  it('should return the correct piece of state', () => {
    const store = {
      state: {
        foo: { fizz: true, buzz: false },
        'right@piece': { isRight: true },
      },
    }
    const [result] = stateMiddleware(store, { name: 'foo', stateId: 'bar' })
    const [result2] = stateMiddleware(store, {
      name: 'right',
      stateId: 'piece',
    })
    expect(result).toMatchObject(initialState)
    expect(result2).toMatchObject({ isRight: true })
  })

  it('should return a contextual setState with a callback', () => {
    const store = {
      state: {
        foo: { fizz: true, buzz: false },
      },
      setState: jest.fn(),
    }
    const [, setState] = stateMiddleware(store, { name: 'foo', stateId: 'bar' })
    const callback = jest.fn()
    setState({ another: 'prop' }, callback)
    expect(store.setState).toHaveBeenCalledWith(
      { 'foo@bar': { another: 'prop' } },
      'foo@bar',
    )
    expect(callback).toHaveBeenCalledWith(store.state)
  })

  describe('should return a logger that will debug if asked', () => {
    const store = {
      state: {
        foo: { fizz: true, buzz: false },
      },
      setState: jest.fn(),
    }
    const [, , log] = stateMiddleware(store, {
      name: 'foo',
      stateId: 'bar',
      debugActions: true,
    })

    it('logger should have defaults', () => {
      log()({ foo: 'bar' })
      expect(consoleGroup).toHaveBeenCalledWith(
        'FIND REQUEST [foo@bar]',
        'orange',
      )
    })

    it('logger should use colors', () => {
      log('GET', 'FAIL')({ foo: 'bar' })
      expect(consoleGroup).toHaveBeenCalledWith('GET FAIL [foo@bar]', 'red')
    })
  })

  it('logger should not log if not asked', () => {
    const store = {
      state: {
        foo: { fizz: true, buzz: false },
      },
      setState: jest.fn(),
    }
    const [, , log] = stateMiddleware(store, { name: 'foo', stateId: 'bar' })
    log()({ foo: 'bar' })
    expect(consoleGroup).not.toHaveBeenCalled()
  })
})

describe('addToItem', () => {
  const item = { id: 5, name: 'foo' }
  it('adds new attributes to object if given id matches its id', () => {
    const result = addToItem(item, '5', { foo: 'bar', fizz: 'buzz' })
    expect(result).toMatchObject({
      id: 5,
      name: 'foo',
      foo: 'bar',
      fizz: 'buzz',
    })
  })

  it('doest not add attributes if given id does not matche its id', () => {
    const result = addToItem(item, 4, { foo: 'bar', fizz: 'buzz' })
    expect(result).toEqual(item)
  })
})

describe('fetchMap', () => {
  it('returns fetchingList for list', () => {
    const result = fetchMap('list')
    expect(result).toBe('fetchingList')
  })

  it('returns fetchingInfo otherwise', () => {
    const result = fetchMap('foo')
    expect(result).toBe('fetchingInfo')
  })
})
