import compact from 'lodash/compact'
import get from 'lodash/get'
import find from 'lodash/find'
import toUpper from 'lodash/toUpper'
import initialState from '../initialState'
import { consoleGroup } from '../logger'

const joinWith = (mark, ...args) => compact(args).join(mark)

const findStatePiece = (state, name, parentId) => {
  const path = joinWith('@', name, parentId)
  const piece = get(state, path, initialState)
  return piece
}

const fetchMap = type => (type === 'list' ? 'fetchingList' : 'fetchingInfo')

const addToItem = (item, id, attrs) =>
  item && `${item.id}` === `${id}` ? { ...item, ...attrs } : item

const stateMiddleware = (store, { name, parentId, debugActions }) => {
  const colors = {
    REQUEST: 'yellow',
    SUCCESS: 'green',
    FAIL: 'red',
  }
  const piece = findStatePiece(store.state, name, parentId)
  const setState = (newState, callback) => {
    store.setState({ [name]: newState })
    callback && callback(store.state)
  }
  const log = (operation = 'FIND', actionType = 'REQUEST') => newState => {
    const path = joinWith('@', name, parentId)
    const title = `${toUpper(operation)} ${actionType} [${path}]`
    const state = findStatePiece(newState, name, parentId)
    debugActions && consoleGroup(title, colors[actionType])(state)
  }
  return [piece, setState, log]
}

export default {
  createRequest: (store, options) => {
    const [piece, setState, log] = stateMiddleware(store, options)
    const newState = { ...piece, creating: true, createError: null }
    setState(newState, log('CREATE'))
  },
  createSuccess: (store, options, data, addCreatedToTop) => {
    const [piece, setState, log] = stateMiddleware(store, options)
    const newState = {
      ...piece,
      creating: false,
      createError: null,
      created: data,
      list: addCreatedToTop ? [data, ...piece.list] : [...piece.list, data],
      info: data,
    }
    setState(newState, log('CREATE', 'SUCCESS'))
  },
  createFail: (store, options, error) => {
    const [piece, setState, log] = stateMiddleware(store, options)
    const newState = { ...piece, creating: false, createError: error.message }
    setState(newState, log('CREATE', 'FAIL'))
  },
  getRequest: (store, { operation, ...options }) => {
    const [piece, setState, log] = stateMiddleware(store, options)
    const newState = {
      ...piece,
      [fetchMap(operation)]: true,
      [`${operation}Error`]: null,
    }
    setState(newState, log(operation))
  },
  getSuccess: (store, { operation, ...options }, data) => {
    const [piece, setState, log] = stateMiddleware(store, options)
    const newState = {
      ...piece,
      [fetchMap(operation)]: false,
      [`${operation}Error`]: null,
      [operation]: data,
    }
    setState(newState, log(operation, 'SUCCESS'))
  },
  getFail: (store, { operation, ...options }, error) => {
    const [piece, setState, log] = stateMiddleware(store, options)
    const newState = {
      ...piece,
      [fetchMap(operation)]: false,
      [`${operation}Error`]: error.message,
    }
    setState(newState, log(operation, 'FAIL'))
  },
  setInfo: (store, options) => {
    const [piece, setState, log] = stateMiddleware(store, options)
    const info = find(piece.list, item => `${item.id}` === `${options.id}`)
    if (info) {
      const newState = {
        ...piece,
        info,
      }
      setState(newState, log('SET', 'INFO'))
      return true
    }
    return false
  },
  updateRequest: (store, options, id) => {
    const [piece, setState, log] = stateMiddleware(store, options)
    const status = { updating: true, updateError: null }
    const newState = {
      ...piece,
      ...status,
      info: addToItem(piece.info, id, status),
      list: piece.list.map(item => addToItem(item, id, status)),
    }
    setState(newState, log('UPDATE'))
  },
  updateSuccess: (store, options, { id, data }) => {
    const [piece, setState, log] = stateMiddleware(store, options)
    const status = { updating: false, updateError: null }
    const old = find(piece.list, item => `${item.id}` === `${id}`)
    const updated = { ...old, ...data, ...status }
    const newState = {
      ...piece,
      ...status,
      updated,
      list: piece.list.map(item => (`${item.id}` === `${id}` ? updated : item)),
      info: updated,
    }
    setState(newState, log('UPDATE', 'SUCCESS'))
  },
  updateFail: (store, options, { error, id }) => {
    const [piece, setState, log] = stateMiddleware(store, options)
    const status = { updating: false, updateError: error.message }
    const newState = {
      ...piece,
      ...status,
      info: addToItem(piece.info, id, status),
      list: piece.list.map(item => addToItem(item, id, status)),
    }
    setState(newState, log('UPDATE', 'FAIL'))
  },
  destroyRequest: (store, options, id) => {
    const [piece, setState, log] = stateMiddleware(store, options)
    const status = { destroying: true, destroyError: null }
    const newState = {
      ...piece,
      ...status,
      info: addToItem(piece.info, id, status),
      list: piece.list.map(item => addToItem(item, id, status)),
    }
    setState(newState, log('DESTROY'))
  },
  destroySuccess: (store, options, id) => {
    const [piece, setState, log] = stateMiddleware(store, options)
    const destroyed = find(piece.list, item => `${item.id}` === `${id}`)
    const newState = {
      ...piece,
      destroyed,
      destroying: false,
      list: piece.list.filter(item => item.id !== id),
      info: piece.info && piece.info.id === id ? null : piece.info,
    }
    setState(newState, log('DESTROY', 'SUCCESS'))
  },
  destroyFail: (store, options, { error, id }) => {
    const [piece, setState, log] = stateMiddleware(store, options)
    const status = { destroying: false, destroyError: error.message }
    const newState = {
      ...piece,
      ...status,
      info: addToItem(piece.info, id, status),
      list: piece.list.map(item => addToItem(item, id, status)),
    }
    setState(newState, log('DESTROY', 'FAIL'))
  },
}
