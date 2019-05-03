import uC from './useCroods'
import uS from './useStore'
import Context, { Provider } from './Context'
import FetchComponent from './Fetch'

export const useCroods = uC
export const useStore = uS
export const CroodsProvider = Provider
export const CroodsContext = Context
export const Fetch = FetchComponent

export default { useCroods, useStore, CroodsProvider, CroodsContext, Fetch }
