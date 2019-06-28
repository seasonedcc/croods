import get from 'lodash/get'
import find from 'lodash/find'
import omit from 'lodash/omit'
import initialState from './initialState'
import {
  fetchMap,
  addToItem,
  stateMiddleware,
  updateRootState,
} from './actionHelpers'

import { Store, ID, ActionOptions } from './typeDeclarations'

const getRequest = (
  store: Store,
  { operation = 'info', ...options }: ActionOptions,
) => {
  const [piece, setState, log] = stateMiddleware(store, options)
  const newState = {
    ...piece,
    [fetchMap(operation)]: true,
    [`${operation}Error`]: null,
  }
  setState(newState, log(operation))
  return true
}

const getSuccess = (
  store: Store,
  { operation = 'info', ...options }: ActionOptions,
  data: any,
) => {
  const [piece, setState, log] = stateMiddleware(store, options)
  const newState = {
    ...piece,
    [fetchMap(operation)]: false,
    [`${operation}Error`]: null,
    [operation]: data,
  }
  setState(newState, log(operation, 'SUCCESS'))
  updateRootState(store, options, { [operation]: data })
  return data
}

const getFail = (
  store: Store,
  { operation = 'info', ...options }: ActionOptions,
  error: string,
) => {
  const [piece, setState, log] = stateMiddleware(store, options)
  const newState = {
    ...piece,
    [fetchMap(operation)]: false,
    [`${operation}Error`]: error,
  }
  setState(newState, log(operation, 'FAIL'))
  return false
}

const saveRequest = (store: Store, options: ActionOptions, id: ID) => {
  const [piece, setState, log] = stateMiddleware(store, options)
  const status = { saving: true, saveError: null }
  const newState = {
    ...piece,
    ...status,
    info: id ? addToItem(piece.info, id, status) : piece.info,
    list: id
      ? piece.list.map((item: object) => addToItem(item, id, status))
      : piece.list,
  }
  setState(newState, log('SAVE'))
  return true
}

const saveSuccess = (
  store: Store,
  options: ActionOptions,
  { id, data }: any,
  addCreatedToTop: boolean,
) => {
  const [piece, setState, log] = stateMiddleware(store, options)
  const status = { saving: false, saveError: null }
  const old = id ? find(piece.list, item => `${item.id}` === `${id}`) : data
  const saved = { ...old, ...data }
  const hasData = saved && !!Object.keys(saved).length
  if (hasData) {
    const state = { ...saved, ...status }
    const addToList = (list: any[], item: object, toTop: boolean) =>
      toTop ? [item, ...list] : [...list, item]
    const newState = {
      ...piece,
      ...status,
      list: id
        ? piece.list.map((item: any) =>
            `${item.id}` === `${id}` ? state : item,
          )
        : addToList(piece.list, state, addCreatedToTop),
      info:
        `${state.id}` === `${get(piece, 'info.id')}` || !piece.info
          ? state
          : piece.info,
    }
    const { info, list } = newState
    setState(newState, log('SAVE', 'SUCCESS'))
    updateRootState(store, options, { info, list })
    return saved
  }
  const newState = { ...piece, ...status }
  const { info, list } = piece
  updateRootState(store, options, { info, list })
  setState(newState, log('SAVE', 'SUCCESS'))
  return null
}

const saveFail = (store: Store, options: ActionOptions, { error, id }: any) => {
  const [piece, setState, log] = stateMiddleware(store, options)
  const status = { saving: false, saveError: error }
  const newState = {
    ...piece,
    ...status,
    info: id ? addToItem(piece.info, id, status) : piece.info,
    list: id
      ? piece.list.map((item: any) => addToItem(item, id, status))
      : piece.list,
  }
  setState(newState, log('SAVE', 'FAIL'))
  return false
}

const destroyRequest = (store: Store, options: ActionOptions, id: ID) => {
  const [piece, setState, log] = stateMiddleware(store, options)
  const status = { destroying: true, destroyError: null }
  const newState = {
    ...piece,
    ...status,
    info: addToItem(piece.info, id, status),
    list: piece.list.map((item: any) => addToItem(item, id, status)),
  }
  setState(newState, log('DESTROY'))
  return true
}

const destroySuccess = (store: Store, options: ActionOptions, id: ID) => {
  const [piece, setState, log] = stateMiddleware(store, options)
  const destroyed = find(piece.list, item => `${item.id}` === `${id}`)
  const newState = {
    ...piece,
    destroying: false,
    list: piece.list.filter((item: any) => item.id !== id),
    info: piece.info && piece.info.id === id ? null : piece.info,
  }
  const { info, list } = newState
  setState(newState, log('DESTROY', 'SUCCESS'))
  updateRootState(store, options, { info, list })
  return destroyed
}

const destroyFail = (
  store: Store,
  options: ActionOptions,
  { error, id }: any,
) => {
  const [piece, setState, log] = stateMiddleware(store, options)
  const status = { destroying: false, destroyError: error }
  const newState = {
    ...piece,
    ...status,
    info: addToItem(piece.info, id, status),
    list: piece.list.map((item: any) => addToItem(item, id, status)),
  }
  setState(newState, log('DESTROY', 'FAIL'))
  return false
}

const setInfo = (
  store: Store,
  options: ActionOptions,
  info: object,
  merge?: boolean,
) => {
  const [piece, setState, log] = stateMiddleware(store, options)
  const newState = {
    ...piece,
    info: merge ? { ...piece.info, ...info } : info,
  }
  setState(newState, log('SET', 'INFO'))
  return newState.info
}

const setList = (
  store: Store,
  options: ActionOptions,
  list: [],
  merge: boolean,
) => {
  const [piece, setState, log] = stateMiddleware(store, options)
  const newState = {
    ...piece,
    list: merge ? piece.list.concat(list) : list,
  }
  setState(newState, log('SET', 'LIST'))
  return newState.list
}

const clearMessages = (store: Store, options: ActionOptions) => {
  const [piece, setState, log] = stateMiddleware(store, options)
  const messagesArray = ['infoError', 'listError', 'saveError', 'destroyError']
  const clearObject = (obj: object) => omit(obj, messagesArray)
  const newState = {
    ...initialState,
    info: clearObject(piece.info),
    list: piece.list.map(clearObject),
  }
  setState(newState, log('CLEAR', 'MESSAGES'))
}

const resetState = (store: Store, options: ActionOptions) => {
  const [, setState, log] = stateMiddleware(store, options)
  setState(initialState, log('CLEAR', 'STATE PIECE'))
}

const setInfoFromList = (store: Store, options: ActionOptions) => {
  const [piece] = stateMiddleware(store, options)
  const info = find(piece.list, item => `${item.id}` === `${options.id}`)
  if (info) {
    return setInfo(store, options, info, false)
  }
  return false
}

export default {
  getRequest,
  getSuccess,
  getFail,
  saveRequest,
  saveSuccess,
  saveFail,
  destroyRequest,
  destroySuccess,
  destroyFail,
  setInfo,
  setList,
  setInfoFromList,
  clearMessages,
  resetState,
}
