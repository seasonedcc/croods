import useStore from './useStore'
import customActions from './actions'

type UseGlobalFunction = (path?: string) => any[]
const store: UseGlobalFunction = useStore(customActions)

export default store
