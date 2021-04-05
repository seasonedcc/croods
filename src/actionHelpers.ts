import toUpper from 'lodash/toUpper'
import findStatePiece from './findStatePiece'
import joinWith from './joinWith'
import { consoleGroup } from './logger'
import {
  Store,
  ActionOptions,
  GlobalState,
  CroodsState,
} from './typeDeclarations'

interface SetState {
  (newPiece: CroodsState, callback?: (t: GlobalState) => void): void
}

export const fetchMap = (type: string) =>
  type === 'list' ? 'fetchingList' : 'fetchingInfo'

export const sameId = (id?: number | string) => (item: any | null) =>
  item && `${item?.id}` === `${id}`

export const addToItem = (
  item: any | null,
  id: number | string,
  attrs: object,
) => {
  return sameId(id)(item) ? { ...item, ...attrs } : item
}

export const replaceItem = (
  id: number | string,
  newItem: Record<string, any>,
) => (item: Record<string, any> | null) => {
  return sameId(id)(item) ? newItem : item
}

export const stateMiddleware = (
  store: Store,
  { name, stateId, debugActions }: ActionOptions,
): [CroodsState, SetState, Function] => {
  if (!name) {
    throw new Error('You must provide a name to Croods')
  }
  const piece = findStatePiece(store.state, name, stateId)
  const path = joinWith('@', name, stateId)
  const setState: SetState = (newPiece, callback) => {
    store.setState({ [path]: newPiece }, path)
    callback && callback(store.state)
  }
  const log = (operation = 'FIND', actionType = 'REQUEST') => (
    newState: GlobalState,
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
