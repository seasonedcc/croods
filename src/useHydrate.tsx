import { useState, useContext, useEffect } from 'react'
import toUpper from 'lodash/toUpper'

import { findStatePiece } from './findStatePiece'
import { consoleGroup } from './logger'
import { getStateKey } from './findStatePiece'
import { useGlobal } from './useGlobal'

import type { CroodsData, ProviderOptions, FetchType, ID } from './types'
import type { UseCroodsOptions } from './useCroods'

type HydrateOptions = {
  name: string
  stateId?: ID
  type?: FetchType
  value: CroodsData
}

const useHydrate = (
  { type = 'list', name, stateId, value }: HydrateOptions,
  config?: ProviderOptions,
): void => {
  if (typeof name !== 'string' || name.length < 1) {
    throw new Error('You must pass a name property to useHydrate')
  }
  const [hydrated, setHydrated] = useState(false)

  const baseOptions: CroodsProviderOptions = useContext(Context)
  const options: UseCroodsOptions = { name, ...baseOptions, ...config }
  const contextPath: string = getStateKey(name, stateId)
  const [state, { setInfo, setList }] = useGlobal(contextPath)

  useEffect(() => {
    if (type === 'list') {
      setList({ name: contextPath }, value)
    }
    if (type === 'info') {
      setInfo({ name: contextPath }, value)
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (hydrated && options.debugActions) {
      const statePiece = findStatePiece(state, name, stateId)
      const title = `${toUpper(type)} HYDRATE [${contextPath}]`
      consoleGroup(title, 'cornflowerblue')(statePiece, state)
    }
  }, [hydrated, options.debugActions])
}

export { useHydrate }
export type { HydrateOptions }
