import uC from './useCroods'
import Context, { Provider } from './Context'
import ListComponent from './List'
import InfoComponent from './Info'

export const useCroods = uC
export const CroodsProvider = Provider
export const CroodsContext = Context
export const List = ListComponent
export const Info = InfoComponent

export default { useCroods, CroodsProvider, CroodsContext }
