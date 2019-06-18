import { ActionOptions, ID, CroodsState } from './types'

export default ({ cache, ...options }: ActionOptions) => (
  id: ID,
  piece: CroodsState,
  setInfo: Function,
) => {
  if (!id && piece.list && !!piece.list.length && cache) return true
  const hasInfo =
    id && piece.list && piece.list.length && setInfo({ ...options, id })
  return !!(hasInfo && cache)
}
