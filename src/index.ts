import uC from './useCroods'
import uS from './useStore'
import Context, { CProvider } from './Context'
import FetchComponent from './Fetch'
import store from './store'
import uH from './useHydrate'

export const useCroods = uC
export const useStore = uS
export const useCroodsStore = store
export const useHydrate = uH
export const CroodsProvider = CProvider
export const CroodsContext = Context
export const Fetch = FetchComponent

export default {
  useCroods,
  useStore,
  useCroodsStore,
  useHydrate,
  CroodsProvider,
  CroodsContext,
  Fetch,
}
