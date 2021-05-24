import type { ActionOptions, CroodsState, ID, Info } from './typeDeclarations'

const shouldUseCache =
  ({ cache, ...options }: ActionOptions) =>
  (
    id: ID | undefined,
    piece: CroodsState,
    setInfo: (t: Info) => void,
  ): boolean => {
    if (!id && piece.list && !!piece.list.length && cache) return true
    const hasInfo =
      id && piece.list && piece.list.length && setInfo({ ...options, id })
    return !!(hasInfo && cache)
  }

export default shouldUseCache
