import useStore from './useStore'
import customActions from './actions'

type CustomActions = typeof customActions
export type Actions = {
  [K in keyof CustomActions]: CustomActions[K]
}

const store = useStore<Actions>(customActions, {})

export default store
