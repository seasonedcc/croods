import get from 'lodash/get'
import * as actions from '../actions'

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
      const data = [
        { id: 1, name: 'sample' },
        { id: 2, name: 'example' },
      ]
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
    const error = 'Could not retrieve data'
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
        listError: error,
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
        infoError: error,
      })
    })
  })

  describe('setInfoFromList', () => {
    it('returns false if unexistent in list', () => {
      const result = actions.setInfoFromList(store, {
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
      const result = actions.setInfoFromList(store, {
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
    it('saves the item when there is an id', () => {
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
      const data = { id: 1, foo: 'bar', fizz: 'buzz' }
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
      const data = { id: 1, foo: 'buzz', fizz: 'bar' }
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
        { id: 1, error: message },
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
        { error: message },
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
        { id: 2, error: message },
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
