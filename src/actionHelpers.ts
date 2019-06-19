import toUpper from 'lodash/toUpper'
import findStatePiece from './findStatePiece'
import joinWith from './joinWith'
import { consoleGroup } from './logger'
import { CroodsState, Store, ActionOptions } from './typeDeclarations'

export const fetchMap = (type: string) =>
  type === 'list' ? 'fetchingList' : 'fetchingInfo'

export const addToItem = (
  item: any | null,
  id: number | string,
  attrs: object,
) => (item && `${item.id}` === `${id}` ? { ...item, ...attrs } : item)

export const stateMiddleware = (
  store: Store,
  { name, stateId, debugActions }: any,
) => {
  const piece = findStatePiece(store.state, name, stateId)
  const path = joinWith('@', name, stateId)
  const setState = (newState: CroodsState, callback?: Function) => {
    store.setState({ [path]: newState }, path)
    callback && callback(store.state)
  }
  const log = (operation = 'FIND', actionType = 'REQUEST') => (
    newState: CroodsState,
  ) => {
    if (!debugActions) return null
    const colors: any = {
      REQUEST: 'orange',
      SUCCESS: 'green',
      FAIL: 'red',
    }
    const title = `${toUpper(operation)} ${actionType} [${path}]`
    const state = findStatePiece(newState, name, stateId)
    return consoleGroup(title, colors[actionType])(state, newState)
  }
  return [piece, setState, log]
}

export const updateRootState = (
  store: Store,
  options: ActionOptions,
  data: any,
) => {
  const { stateId, name, updateRoot, updateRootInfo, updateRootList } = options
  if (name) {
    const shouldChangeRoot =
      stateId && (updateRoot || updateRootInfo || updateRootList)
    if (shouldChangeRoot) {
      const rootPiece = findStatePiece(store.state, name)
      const state = {
        ...rootPiece,
        info: updateRoot || updateRootInfo ? data.info : rootPiece.info,
        list: updateRoot || updateRootList ? data.list : rootPiece.list,
      }
      store.setState({ [name]: state }, name)
    }
  }
}
