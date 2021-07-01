import { useEffect, useCallback } from 'react'

import { runApi } from './private/runApi'
import { findStatePiece, getStateKey } from './private/findStatePiece'
import { useGlobal } from './private/useGlobal'
import { useBaseOptions } from './baseOptionsProvider'

import type {
  ActionOptions,
  Actions,
  ProviderOptions,
  CroodsState,
  ID,
  QueryStringObj,
  ReqBody,
  SaveOptions,
} from './types'

type CroodsTuple<T extends any = any> = [CroodsState<T>, Actions<T>]
type UseCroodsOptions = ProviderOptions & {
  name: string
  id?: ID
  path?: string
  customPath?: string
  stateId?: ID
  query?: QueryStringObj
  fetchOnMount?: boolean
}
const useCroods = <T extends any = any>({
  name,
  stateId,
  fetchOnMount,
  ...opts
}: UseCroodsOptions): CroodsTuple<T> => {
  if (typeof name !== 'string' || name.length < 1) {
    throw new Error('You must pass a name property to useCroods/Fetch')
  }
  const baseOptions = useBaseOptions()
  const contextPath: string = getStateKey(name, stateId)
  const [state, actions] = useGlobal(contextPath)
  const piece = findStatePiece(state, name, stateId, fetchOnMount, opts.id)

  const options: UseCroodsOptions = { ...baseOptions, ...opts, name, stateId }

  const fetch = useCallback(
    (contextOpts: ActionOptions = {}) =>
      async (): Promise<T> => {
        const execute = await runApi<T>({
          options: { ...options, ...contextOpts },
          actions,
          requestType: { kind: 'fetch', piece },
        })
        return execute()
      },
    [actions, options, piece],
  )

  const save = useCallback(
    (contextOpts: ActionOptions = {}, saveOpts: SaveOptions = {}) =>
      async (rawBody?: ReqBody): Promise<T> => {
        const execute = await runApi<T>({
          options: { ...options, ...contextOpts },
          actions,
          requestType: { kind: 'save', options: saveOpts },
        })
        return execute(rawBody)
      },
    [actions, options],
  )

  const destroy = useCallback(
    (contextOpts: ActionOptions = {}) =>
      async (): Promise<T> => {
        const execute = await runApi<T>({
          options: { ...options, ...contextOpts },
          actions,
          requestType: { kind: 'destroy' },
        })
        return execute()
      },
    [actions, options],
  )

  const setInfo = useCallback(
    (info: Partial<T>, merge?: boolean) => {
      actions.setInfo(options, info, merge)
    },
    [actions, options],
  )

  const setList = useCallback(
    (list: Partial<T>[], merge?: boolean) => {
      actions.setList(options, list, merge)
    },
    [actions, options],
  )

  useEffect(() => {
    fetchOnMount && fetch({ id: options.id, query: options.query })()
  }, [options.id, options.query, fetchOnMount])

  return [piece, { fetch, save, destroy, setInfo, setList }]
}

export { useCroods }
export type { CroodsTuple, UseCroodsOptions }
