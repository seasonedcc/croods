import { useStore } from '../useStore'
import * as customActions from './actions'

type CustomActions = typeof customActions
type InternalActions = {
  [K in keyof CustomActions]: CustomActions[K]
}

const useGlobal = useStore<InternalActions>(customActions, {})

export { useGlobal }
