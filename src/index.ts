import uC from './useCroods'
import uS from './useStore'
import Context, { CProvider } from './Context'
import FetchComponent from './Fetch'

export const useCroods = uC
export const useStore = uS
export const CroodsProvider = CProvider
export const CroodsContext = Context
export const Fetch = FetchComponent

export default {
  useCroods,
  useStore,
  CroodsProvider,
  CroodsContext,
  Fetch,
}
