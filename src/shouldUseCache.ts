import { ActionOptions, ID, CroodsState } from './typeDeclarations'

const shouldUseCache = ({ cache, ...options }: ActionOptions) => (
  id: ID,
  piece: CroodsState,
  setInfo: Function,
): boolean => {
  if (!id && piece.list && !!piece.list.length && cache) return true
  const hasInfo =
    id && piece.list && piece.list.length && setInfo({ ...options, id })
  return !!(hasInfo && cache)
}

export default shouldUseCache
