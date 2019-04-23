import get from 'lodash/get'
import actions, { fetchMap, addToItem, stateMiddleware } from '../actions'
import initialState from '../initialState'
import { consoleGroup } from '../logger'

afterEach(jest.clearAllMocks)

jest.mock('../logger', () => ({
  consoleGroup: jest.fn(() => jest.fn()),
}))

describe('actions', () => {
  let state = {}
  const store = {
    state,
    setState: obj => {
      const newState = { ...state, ...obj }
      state = newState
      store.state = newState
    },
  }

  describe('getRequest', () => {
    it('starts fetching a list', () => {
      const result = actions.getRequest(store, {
        operation: 'list',
        name: 'get',
        stateId: 'list',
      })

      expect(result).toBeTruthy()
      expect(get(store.state, 'get@list')).toMatchObject({
        fetchingList: true,
        listError: null,
      })
    })

    it('starts fetching info', () => {
      const result = actions.getRequest(store, {
        operation: 'info',
        name: 'get',
      })

      expect(result).toBeTruthy()
      expect(get(store.state, 'get')).toMatchObject({
        fetchingInfo: true,
        infoError: null,
      })
    })
  })

  describe('getSuccess', () => {
    it('sets the received list data', () => {
      const data = [{ id: 1, name: 'sample' }, { id: 2, name: 'example' }]
      const result = actions.getSuccess(
        store,
        {
          operation: 'list',
          name: 'get',
          stateId: 'list',
        },
        data,
      )

      expect(result).toEqual(data)
      expect(get(store.state, 'get@list')).toMatchObject({
        fetchingList: false,
        listError: null,
        list: data,
      })
    })
    it('sets the received info data', () => {
      const data = { id: 1, name: 'sample' }
      const result = actions.getSuccess(
        store,
        {
          operation: 'info',
          name: 'get',
        },
        data,
      )

      expect(result).toEqual(data)
      expect(get(store.state, 'get')).toMatchObject({
        fetchingInfo: false,
        infoError: null,
        info: data,
      })
    })
  })

  describe('getFail', () => {
    const error = { message: 'Could not retrieve data' }
    it('sets the received list error', () => {
      const result = actions.getFail(
        store,
        {
          operation: 'list',
          name: 'get',
          stateId: 'list',
        },
        error,
      )

      expect(result).toBeFalsy()
      expect(get(store.state, 'get@list')).toMatchObject({
        fetchingList: false,
        listError: error.message,
      })
    })

    it('sets the received info error', () => {
      const result = actions.getFail(
        store,
        {
          operation: 'info',
          name: 'get',
        },
        error,
      )

      expect(result).toBeFalsy()
      expect(get(store.state, 'get')).toMatchObject({
        fetchingInfo: false,
        infoError: error.message,
      })
    })
  })

  describe('setInfo', () => {
    it('returns false if unexistent in list', () => {
      const result = actions.setInfo(store, {
        id: 10,
        name: 'get',
        stateId: 'list',
      })

      expect(result).toBeFalsy()
      expect(get(store.state, 'get@list')).toMatchObject({
        info: null,
      })
    })

    it('sets info from list and returns it if it exists', () => {
      const result = actions.setInfo(store, {
        id: 1,
        name: 'get',
        stateId: 'list',
      })
      const data = { id: 1, name: 'sample' }

      expect(result).toEqual(data)
      expect(get(store.state, 'get@list')).toMatchObject({
        info: data,
      })
    })
  })

  describe('saveRequest', () => {
    it('starts saving an item when there is an id', () => {
      const result = actions.saveRequest(
        store,
        {
          name: 'get',
          stateId: 'list',
        },
        1,
      )

      expect(result).toBeTruthy()
      expect(get(store.state, 'get@list')).toMatchObject({
        saving: true,
        saveError: null,
      })
      expect(get(store.state, 'get@list.info')).toMatchObject({
        saving: true,
        saveError: null,
      })
      expect(get(store.state, 'get@list.list.0')).toMatchObject({
        saving: true,
        saveError: null,
      })
    })

    it('starts creating an item when there is no id', () => {
      const result = actions.saveRequest(store, {
        name: 'get',
      })

      expect(result).toBeTruthy()
      expect(get(store.state, 'get')).toMatchObject({
        saving: true,
        saveError: null,
      })
      expect(get(store.state, 'get.info')).not.toMatchObject({
        saving: true,
      })
      expect(get(store.state, 'get.list')).toMatchObject([])
    })
  })

  describe('saveSuccess', () => {
    it('starts saving an item when there is an id', () => {
      const result = actions.saveSuccess(
        store,
        {
          name: 'get',
          stateId: 'list',
        },
        { id: 1, data: { another: 'prop' } },
      )

      expect(result).toMatchObject({ another: 'prop', id: 1 })
      expect(get(store.state, 'get@list')).toMatchObject({
        saving: false,
        saveError: null,
      })
      expect(get(store.state, 'get@list.saved')).toMatchObject({
        id: 1,
        another: 'prop',
      })
      expect(get(store.state, 'get@list.info')).toMatchObject({
        id: 1,
        another: 'prop',
        saving: false,
        saveError: null,
      })
      expect(get(store.state, 'get@list.list.0')).toMatchObject({
        id: 1,
        another: 'prop',
        saving: false,
        saveError: null,
      })
    })

    it('creates the item when there is no id', () => {
      const data = { foo: 'bar', fizz: 'buzz' }
      const result = actions.saveSuccess(
        store,
        {
          name: 'get',
        },
        { data },
      )

      expect(result).toMatchObject({ fizz: 'buzz' })
      expect(get(store.state, 'get')).toMatchObject({
        saving: false,
        saveError: null,
      })
      expect(get(store.state, 'get.info')).toMatchObject({
        saving: false,
        fizz: 'buzz',
      })
      expect(get(store.state, 'get.list')).toMatchObject([data])
    })

    it('creates an item on top of list when property is passed', () => {
      const data = { foo: 'buzz', fizz: 'bar' }
      const result = actions.saveSuccess(
        store,
        {
          name: 'get',
        },
        { data },
        true,
      )

      expect(result).toMatchObject({ fizz: 'bar' })
      expect(get(store.state, 'get.info')).toMatchObject({
        saving: false,
        fizz: 'bar',
      })
      expect(get(store.state, 'get.list.0')).toMatchObject(data)
      expect(get(store.state, 'get.list').length).toBe(2)
    })
  })

  describe('saveFail', () => {
    it('shows the error for the item if there is an id', () => {
      const message = 'Could not save data'
      const result = actions.saveFail(
        store,
        {
          name: 'get',
          stateId: 'list',
        },
        { id: 1, error: { message } },
      )

      expect(result).toBeFalsy()
      expect(get(store.state, 'get@list')).toMatchObject({
        saving: false,
        saveError: message,
      })
      expect(get(store.state, 'get@list.info')).toMatchObject({
        id: 1,
        saving: false,
        saveError: message,
      })
      expect(get(store.state, 'get@list.list.0')).toMatchObject({
        id: 1,
        saving: false,
        saveError: message,
      })
    })

    it('shows the error for when there is no id', () => {
      const message = 'Could not save data'
      const result = actions.saveFail(
        store,
        {
          name: 'get',
        },
        { error: { message } },
      )

      expect(result).toBeFalsy()
      expect(get(store.state, 'get')).toMatchObject({
        saving: false,
        saveError: message,
      })
      expect(get(store.state, 'get.list.0')).not.toMatchObject({
        saveError: message,
      })
    })
  })

  describe('destroyRequest', () => {
    it('starts deleting ', () => {
      const result = actions.destroyRequest(
        store,
        {
          name: 'get',
          stateId: 'list',
        },
        1,
      )

      expect(result).toBeTruthy()
      expect(get(store.state, 'get@list')).toMatchObject({
        destroying: true,
        destroyError: null,
      })
      expect(get(store.state, 'get@list.info')).toMatchObject({
        id: 1,
        destroying: true,
        destroyError: null,
      })
      expect(get(store.state, 'get@list.list.0')).toMatchObject({
        id: 1,
        destroying: true,
        destroyError: null,
      })
    })
  })

  describe('destroySuccess', () => {
    it('deletes the item and removes from list ', () => {
      const result = actions.destroySuccess(
        store,
        {
          name: 'get',
          stateId: 'list',
        },
        1,
      )

      expect(result.id).toBe(1)
      expect(get(store.state, 'get@list')).toMatchObject({
        destroying: false,
        destroyError: null,
      })
      expect(get(store.state, 'get@list.destroyed.id')).toBe(1)
      expect(get(store.state, 'get@list.info')).toBe(null)
      expect(get(store.state, 'get@list.list.0.id')).toBe(2)
      expect(get(store.state, 'get@list.list.length')).toBe(1)
    })
  })

  describe('destroyFail', () => {
    it('adds error message to items ', () => {
      const message = 'Could not delete item'
      const result = actions.destroyFail(
        store,
        {
          name: 'get',
          stateId: 'list',
        },
        { id: 2, error: { message } },
      )

      expect(result).toBe(false)
      expect(get(store.state, 'get@list')).toMatchObject({
        destroying: false,
        destroyError: message,
      })
      expect(get(store.state, 'get@list.list.0')).toMatchObject({
        id: 2,
        destroying: false,
        destroyError: message,
      })
    })
  })
})

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
    expect(store.setState).toHaveBeenCalledWith({
      'foo@bar': { another: 'prop' },
    })
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
        'yellow',
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
