export default ({ cache, ...options }) => (id, piece, setInfo) => {
  if (!id && !!piece.list.length && cache) return true
  const hasInfo = id && piece.list.length && setInfo({ ...options, id })
  return !!(hasInfo && cache)
}
