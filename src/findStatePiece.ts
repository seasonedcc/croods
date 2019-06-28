import get from 'lodash/get'
import joinWith from './joinWith'
import { ID, GlobalState, CroodsState } from './typeDeclarations'
import initialState from './initialState'

export function findPath(name: string, stateId?: ID): string {
  return joinWith('@', name, stateId)
}

function findStatePiece(
  state: GlobalState,
  name: string,
  stateId?: ID,
  initializeFetching?: boolean,
  id?: ID,
): CroodsState {
  const path = findPath(name, stateId)
  const piece: CroodsState | undefined = get(state, path)
  const hasId = !!id
  return (
    piece || {
      ...initialState,
      fetchingInfo: !!(initializeFetching && hasId),
      fetchingList: !!(initializeFetching && !hasId),
    }
  )
}

export default findStatePiece
