import {
  fetchMap,
  addToItem,
  replaceItem,
  sameId,
  stateMiddleware,
  updateRootState,
} from '../actionHelpers'
import { initialState } from '../initialState'
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

  it('should throw an error when there is no name', () => {
    const store = {
      state: {
        foo: { fizz: true, buzz: false },
        'right@piece': { isRight: true },
      },
    }

    expect(() => stateMiddleware(store, { stateId: 'bar' })).toThrow(
      'You must provide a name to Croods',
    )
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
        'INFO REQUEST [foo@bar]',
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

describe('sameId', () => {
  const item = { id: 5, name: 'foo' }
  it('compares ids stringifying them', () => {
    const result = sameId('5')(item)
    const result2 = sameId(4)(item)
    expect([result, result2]).toMatchObject([true, false])
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

describe('replaceItem', () => {
  const item = { id: 5, name: 'foo' }
  it('replaces object if given id matches its id', () => {
    const result = replaceItem('5', { foo: 'bar', fizz: 'buzz' })(item)
    expect(result).toMatchObject({
      foo: 'bar',
      fizz: 'buzz',
    })
  })

  it('doest not add attributes if given id does not matche its id', () => {
    const result = replaceItem(4, { foo: 'bar', fizz: 'buzz' })(item)
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

describe('updateRootState', () => {
  const store = {
    state: {
      foo: { info: { foo: 'info' }, fizz: true, buzz: false },
      'right@piece': { isRight: true },
    },
    setState: jest.fn(),
  }

  describe('when should change root', () => {
    const options = {
      stateId: 1,
      name: 'foo',
      updateRoot: true,
    }

    it('calls setState', () => {
      updateRootState(store, options, { info: 'foobar', list: ['abc'] })

      expect(store.setState).toHaveBeenCalledWith(
        { foo: { fizz: true, buzz: false, info: 'foobar', list: ['abc'] } },
        'foo',
      )
    })
  })
})
