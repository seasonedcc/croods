import useStore from './useStore'
import customActions from './actions'

const store = useStore(customActions, {})

export default store
