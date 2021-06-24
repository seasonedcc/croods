import React, { useEffect } from 'react'
import { useCroods, UseCroodsOptions, CroodsTuple } from './useCroods'
import { useBaseOptions } from './Context'
import { CroodsData } from './types'

type FetchOptions = Omit<UseCroodsOptions, 'fetchOnMount'> & {
  render: (t: CroodsData | null, b: CroodsTuple) => React.ReactNode
}

const Fetch = ({
  id,
  query,
  path,
  stateId,
  render,
  renderError,
  renderEmpty,
  renderLoading,
  ...options
}: FetchOptions): JSX.Element => {
  // baseOptions -> config from provider
  const baseOptions = useBaseOptions()
  const errorMessage = state.listError || state.infoError
  const isList = !id
  const result = isList ? state.list : state.info

  useEffect(() => {
    actions.fetch({ id })(query)
    // eslint-disable-next-line
  }, [id, query, path, stateId])

  if (isList ? state.fetchingList : state.fetchingInfo) {
    const loading =
      renderLoading ||
      get(baseOptions, 'renderLoading') ||
      (() => <div>Loading...</div>)
    return loading()
  }

  if (errorMessage) {
    const renderErrorMessage =
      renderError ||
      get(baseOptions, 'renderError') ||
      ((error: string) => <div style={{ color: 'red' }}>{error}</div>)
    return renderErrorMessage(errorMessage)
  }

  if (!isList && !state.info) {
    return (renderEmpty || get(baseOptions, 'renderEmpty') || (() => null))()
  }

  if (
    isList &&
    (!state.list || !state.list.length) &&
    (renderEmpty || get(baseOptions, 'renderEmpty'))
  ) {
    return (renderEmpty || get(baseOptions, 'renderEmpty'))()
  }

  return <React.Fragment>{render(result, [state, actions])}</React.Fragment>
}

export { Fetch }
export type { FetchOptions }
