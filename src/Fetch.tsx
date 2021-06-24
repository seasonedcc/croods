import React, { useEffect } from 'react'
import { useCroods, UseCroodsOptions, CroodsTuple } from './useCroods'
import { useBaseOptions } from './baseOptionsProvider'
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
  ...opts
}: FetchOptions): React.ReactNode => {
  // baseOptions -> config from provider
  const baseOptions = useBaseOptions()
  const options: UseCroodsOptions = {
    ...baseOptions,
    ...opts,
    id,
    path,
    stateId,
  }
  const [state, actions] = useCroods(options)
  const errorMessage = state.listError || state.infoError
  const isList = !id
  const result = isList ? state.list : state.info

  useEffect(() => {
    actions.fetch({ id })(query)
    // eslint-disable-next-line
  }, [id, query, path, stateId])

  if (isList ? state.fetchingList : state.fetchingInfo) {
    return options.renderLoading?.() || <div>Loading...</div>
  }

  if (errorMessage) {
    return (
      options.renderError?.(errorMessage) || (
        <div style={{ color: 'red' }}>{errorMessage}</div>
      )
    )
  }

  if (!isList && !state.info) {
    return options.renderEmpty?.() || null
  }

  if (isList && (!state.list || !state.list.length) && options.renderEmpty) {
    return options.renderEmpty?.() || null
  }

  return <React.Fragment>{render(result, [state, actions])}</React.Fragment>
}

export { Fetch }
export type { FetchOptions }
