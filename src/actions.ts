import get from 'lodash/get'
import find from 'lodash/find'
import toUpper from 'lodash/toUpper'
import {
  fetchMap,
  addToItem,
  replaceItem,
  sameId,
  stateMiddleware,
  updateRootState,
  Operation,
} from './actionHelpers'

import type { ActionOptions, CroodsData, ID, Info } from './types'
import type { Store } from './useStore'

type ObjWithId = { id: ID }
type ActionError = { error: string; id?: ID }
const getRequest = (
  store: Store,
  { operation = 'info', ...options }: ActionOptions,
): boolean => {
  const [piece, setState, log] = stateMiddleware(store, options)
  const newState = {
    ...piece,
    [fetchMap(operation)]: true,
    [`${operation}Error`]: null,
  }
  setState(newState, log(toUpper(operation) as Operation))
  return true
}

const getSuccess = (
  store: Store,
  { operation = 'info', ...options }: ActionOptions,
  data: CroodsData,
): CroodsData => {
  const [piece, setState, log] = stateMiddleware(store, options)
  const newState = {
    ...piece,
    [fetchMap(operation)]: false,
    [`${operation}Error`]: null,
    [operation]: data,
  }
  setState(newState, log(toUpper(operation) as Operation, 'SUCCESS'))
  updateRootState(store, options, { [operation]: data })
  return data
}

const getFail = (
  store: Store,
  { operation = 'info', ...options }: ActionOptions,
  error: string,
): boolean => {
  const [piece, setState, log] = stateMiddleware(store, options)
  const newState = {
    ...piece,
    [fetchMap(operation)]: false,
    [`${operation}Error`]: error,
  }
  setState(newState, log(toUpper(operation) as Operation, 'FAIL'))
  return false
}

const saveRequest = (
  store: Store,
  options: ActionOptions,
  id?: ID,
): boolean => {
  const [piece, setState, log] = stateMiddleware(store, options)
  const status = { saving: true, saveError: null }
  const newState = {
    ...piece,
    ...status,
    info: id ? addToItem(piece.info, id, status) : piece.info,
    list: id
      ? piece.list.map((item: ObjWithId) => addToItem(item, id, status))
      : piece.list,
  }
  setState(newState, log('SAVE'))
  return true
}

const saveSuccess = (
  store: Store,
  options: ActionOptions,
  { id, data }: Info,
  addCreatedToTop?: boolean,
): Info | null => {
  const [piece, setState, log] = stateMiddleware(store, options)
  const status = { saving: false, saveError: null }
  const old = id ? find(piece.list, sameId(id)) : data
  const saved = { ...old, ...data }
  const hasData = saved && !!Object.keys(saved).length
  if (hasData) {
    const state = { ...saved, ...status }
    const addToList = (
      list: Info[],
      item: Record<string, unknown>,
      toTop?: boolean,
    ) => (toTop ? [item, ...list] : [...list, item])
    const newState = {
      ...piece,
      ...status,
      list: id
        ? piece.list.map((item: ObjWithId) => (sameId(id)(item) ? state : item))
        : addToList(piece.list, state, addCreatedToTop),
      info:
        sameId(get(piece, 'info.id'))(state) || !piece.info
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

const saveFail = (
  store: Store,
  options: ActionOptions,
  { error, id }: ActionError,
): boolean => {
  const [piece, setState, log] = stateMiddleware(store, options)
  const status = { saving: false, saveError: error }
  const newState = {
    ...piece,
    ...status,
    info: id ? addToItem(piece.info, id, status) : piece.info,
    list: id
      ? piece.list.map((item: ObjWithId) => addToItem(item, id, status))
      : piece.list,
  }
  setState(newState, log('SAVE', 'FAIL'))
  return false
}

const destroyRequest = (
  store: Store,
  options: ActionOptions,
  id?: ID,
): boolean => {
  const [piece, setState, log] = stateMiddleware(store, options)
  const status = { destroying: true, destroyError: null }
  const newState = {
    ...piece,
    ...status,
    info: id ? addToItem(piece.info, id, status) : piece.info,
    list: id
      ? piece.list.map((item: ObjWithId) => addToItem(item, id, status))
      : piece.list,
  }
  setState(newState, log('DESTROY'))
  return true
}

const destroySuccess = (
  store: Store,
  options: ActionOptions,
  id?: ID,
): Info => {
  const [piece, setState, log] = stateMiddleware(store, options)
  const destroyed = find(piece.list, sameId(id))
  const newState = {
    ...piece,
    destroying: false,
    list: piece.list.filter((item: ObjWithId) => !sameId(id)(item)),
    info: sameId(id)(piece?.info) ? null : piece.info,
  }
  const { info, list } = newState
  setState(newState, log('DESTROY', 'SUCCESS'))
  updateRootState(store, options, { info, list })
  return destroyed
}

const destroyFail = (
  store: Store,
  options: ActionOptions,
  { error, id }: ActionError,
): boolean => {
  const [piece, setState, log] = stateMiddleware(store, options)
  const status = { destroying: false, destroyError: error }
  const newState = {
    ...piece,
    ...status,
    info: id ? addToItem(piece.info, id, status) : piece.info,
    list: id
      ? piece.list.map((item: ObjWithId) => addToItem(item, id, status))
      : piece.list,
  }
  setState(newState, log('DESTROY', 'FAIL'))
  return false
}

const setInfo = (
  store: Store,
  options: ActionOptions,
  info: Info,
  merge?: boolean,
): Info => {
  const [piece, setState, log] = stateMiddleware(store, options)
  const newInfo = merge ? { ...piece.info, ...info } : info
  const newState = {
    ...piece,
    info: newInfo,
    list: info.id ? piece.list.map(replaceItem(info.id, newInfo)) : piece.list,
  }
  setState(newState, log('SET', 'INFO'))
  return newState.info
}

const setList = (
  store: Store,
  options: ActionOptions,
  list: Info[],
  merge?: boolean,
): Info[] => {
  const [piece, setState, log] = stateMiddleware(store, options)
  const newState = {
    ...piece,
    list: merge ? piece.list.concat(list) : list,
  }
  setState(newState, log('SET', 'LIST'))
  return newState.list
}

const setInfoFromList = (
  store: Store,
  options: ActionOptions,
): Info | boolean => {
  const [piece] = stateMiddleware(store, options)
  const info = find(piece.list, sameId(options?.id))
  if (info) {
    return setInfo(store, options, info, false)
  }
  return false
}

export {
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
}
