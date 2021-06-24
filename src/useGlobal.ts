import { useStore } from './useStore'
import * as customActions from './actions'

type CustomActions = typeof customActions
type Actions = {
  [K in keyof CustomActions]: CustomActions[K]
}

const useGlobal = useStore<Actions>(customActions, {})

export { useGlobal }
