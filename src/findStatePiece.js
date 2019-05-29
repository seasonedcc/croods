import get from 'lodash/get'
import joinWith from './joinWith'
import initialState from './initialState'

export const findPath = (name, stateId) => joinWith('@', name, stateId)

export default (state, name, stateId, fetchOnMount, id) => {
  const path = findPath(name, stateId)
  const piece = get(state, path)
  return (
    piece || {
      ...initialState,
      fetchingInfo: !!fetchOnMount && id !== undefined,
      fetchingList: !!fetchOnMount && id === undefined,
    }
  )
}
