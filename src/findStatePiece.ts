import get from 'lodash/get'
import joinWith from './joinWith'
import initialState from './initialState'

import type { CroodsState, GlobalState, ID } from './typeDeclarations'

export function getStateKey(name: string, stateId?: ID): string {
  return joinWith('@', name, stateId)
}

function findStatePiece(
  state: GlobalState,
  name: string,
  stateId?: ID,
  initializeFetching?: boolean,
  id?: ID,
): CroodsState {
  const path = getStateKey(name, stateId)
  const piece: CroodsState | undefined = get(state, path)
  return (
    piece || {
      ...initialState,
      fetchingInfo: !!(initializeFetching && Boolean(id)),
      fetchingList: !!(initializeFetching && !id),
    }
  )
}

export default findStatePiece
