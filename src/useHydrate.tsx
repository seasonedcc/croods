import { useState, useContext, useEffect } from 'react'
import toUpper from 'lodash/toUpper'

import { ProviderOptions, InstanceOptions, HydrateOptions } from './typeDeclarations';

import Context from './Context'
import findStatePiece from './findStatePiece'
import { consoleGroup } from './logger'
import { findPath } from './findStatePiece'
import useGlobal from './store'

const useHydrate = ({
  type = 'list',
  name,
  stateId,
  value,
}: HydrateOptions, config?: ProviderOptions) => {
  if (typeof name !== 'string' || name.length < 1) {
    throw new Error('You must pass a name property to useHydrate')
  }
  const [hydrated, setHydrated] = useState(false)

  const baseOptions: ProviderOptions = useContext(Context)
  const options: InstanceOptions = { name, ...baseOptions, ...config }
  const contextPath: string = findPath(name, stateId)
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

export default useHydrate
