import get from 'lodash/get'
import joinWith from './joinWith'
import { ID, CroodsState } from './types'
import initialState from './initialState'

export const findPath = (name: string, stateId?: ID): string =>
  joinWith('@', name, stateId)

export default (
  state: CroodsState | undefined,
  name: string,
  stateId?: ID,
  initializeFetching?: boolean,
  id?: ID,
) => {
  const path = findPath(name, stateId)
  const piece = get(state, path)
  const hasId = !!id
  return (
    piece || {
      ...initialState,
      fetchingInfo: !!(initializeFetching && hasId),
      fetchingList: !!(initializeFetching && !hasId),
    }
  )
}
