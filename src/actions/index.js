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
  saveRequest: (store, options, id) => {
    const [piece, setState, log] = stateMiddleware(store, options)
    const status = { saving: true, saveError: null }
    const newState = {
      ...piece,
      ...status,
      info: id ? addToItem(piece.info, id, status) : piece.info,
      list: id
        ? piece.list.map(item => addToItem(item, id, status))
        : piece.list,
    }
    setState(newState, log('SAVE'))
  },
  saveSuccess: (store, options, { id, data }, addCreatedToTop) => {
    const [piece, setState, log] = stateMiddleware(store, options)
    const status = { saving: false, saveError: null }
    const old = id ? find(piece.list, item => `${item.id}` === `${id}`) : data
    const saved = { ...old, ...data, ...status }
    const addToList = (list, item, toTop) =>
      toTop ? [item, ...list] : [...list, item]
    const newState = {
      ...piece,
      ...status,
      saved,
      list: id
        ? piece.list.map(item => (`${item.id}` === `${id}` ? saved : item))
        : addToList(piece.list, saved, addCreatedToTop),
      info: saved,
    }
    setState(newState, log('SAVE', 'SUCCESS'))
  },
  saveFail: (store, options, { error, id }) => {
    const [piece, setState, log] = stateMiddleware(store, options)
    const status = { saving: false, saveError: error.message }
    const newState = {
      ...piece,
      ...status,
      info: id ? addToItem(piece.info, id, status) : piece.info,
      list: id
        ? piece.list.map(item => addToItem(item, id, status))
        : piece.list,
    }
    setState(newState, log('SAVE', 'FAIL'))
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
