import uC from './useCroods'
import Context, { Provider } from './Context'
import FetchComponent from './Fetch'

export const useCroods = uC
export const CroodsProvider = Provider
export const CroodsContext = Context
export const Fetch = FetchComponent

export default { useCroods, CroodsProvider, CroodsContext, Fetch }
