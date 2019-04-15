import get from 'lodash/get'
import joinWith from './joinWith'
import initialState from './initialState'

export default (state, name, stateId) => {
  const path = joinWith('@', name, stateId)
  const piece = get(state, path, initialState)
  return piece
}
