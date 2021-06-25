import React, { useEffect } from 'react'

import { useCroods } from './useCroods'
import { useBaseOptions } from './baseOptionsProvider'

import type { UseCroodsOptions, CroodsTuple } from './useCroods'
import { CroodsState } from './types'

type InfoOrList<T> = T extends Array<any>
  ? CroodsState<T[number]>['list']
  : CroodsState<T>['info']
type FetchOptions<T> = Omit<UseCroodsOptions, 'fetchOnMount'> & {
  render: (
    t: InfoOrList<T>,
    b: CroodsTuple<T extends Array<any> ? T[number] : T>,
  ) => JSX.Element | JSX.Element[]
}

function Fetch<T = any>({
  id,
  query,
  path,
  stateId,
  render,
  ...opts
}: FetchOptions<T>): JSX.Element {
  const baseOptions = useBaseOptions()
  const options: UseCroodsOptions = {
    ...baseOptions,
    ...opts,
    id,
    path,
    stateId,
  }
  const [state, actions] =
    useCroods<T extends Array<any> ? T[number] : T>(options)
  const errorMessage = state.listError || state.infoError
  const isList = !id
  const result = isList ? state.list : state.info

  useEffect(() => {
    actions.fetch({ id })(query)
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

  if (!isList && !state.info && options.renderEmpty) {
    return options.renderEmpty?.() || null
  }

  if (isList && !Boolean(state.list?.length) && options.renderEmpty) {
    return options.renderEmpty() || null
  }

  return (
    <React.Fragment>
      {render(result as InfoOrList<T>, [state, actions])}
    </React.Fragment>
  )
}

export { Fetch }
export type { FetchOptions }
