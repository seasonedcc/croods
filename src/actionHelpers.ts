import findStatePiece from './findStatePiece'
import joinWith from './joinWith'
import { consoleGroup } from './logger'
import type {
  ActionOptions,
  ActionType,
  CroodsData,
  CroodsState,
  FetchType,
  GlobalState,
  ID,
  Info,
  Operation,
  Store,
} from './typeDeclarations'

type SetState = {
  (newPiece: CroodsState, callback?: (t: GlobalState) => void): void
}
type ObjWithId = { id: ID }
type Logger = (t?: Operation, v?: ActionType) => (g: GlobalState) => void

export const fetchMap = (type: FetchType): string =>
  type === 'list' ? 'fetchingList' : 'fetchingInfo'

export const sameId =
  (id?: ID) =>
  (item?: ObjWithId): boolean =>
    Boolean(item && String(item?.id) === String(id))

export const addToItem = (
  item: ObjWithId,
  id: ID,
  attrs: Record<string, unknown>,
): Info => {
  return sameId(id)(item) ? { ...item, ...attrs } : item
}

export const replaceItem =
  (id: ID, newItem: ObjWithId) =>
  (item?: ObjWithId): Info => {
    return sameId(id)(item) ? newItem : item
  }

export const stateMiddleware = (
  store: Store,
  { name, stateId, debugActions }: ActionOptions,
): [CroodsState, SetState, Logger] => {
  if (!name) {
    throw new Error('You must provide a name to Croods')
  }
  const piece = findStatePiece(store.state, name, stateId)
  const path = joinWith('@', name, stateId)
  const setState: SetState = (newPiece, callback) => {
    store.setState({ [path]: newPiece }, path)
    callback && callback(store.state)
  }
  const log: Logger =
    (operation = 'INFO', actionType = 'REQUEST') =>
    newState => {
      if (!debugActions) return null
      const colors: Record<string, string> = {
        REQUEST: 'orange',
        SUCCESS: 'green',
        FAIL: 'red',
      }
      const title = `${operation} ${actionType} [${path}]`
      const state = findStatePiece(newState, name, stateId)
      return consoleGroup(title, colors[actionType])(state, newState)
    }
  return [piece, setState, log]
}

type URSOptions = ActionOptions & {
  updateRoot?: boolean
  updateRootInfo?: boolean
  updateRootList?: boolean
}
export const updateRootState = (
  store: Store,
  options: URSOptions,
  data: CroodsData,
): void => {
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
