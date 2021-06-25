import React, { createContext, useContext } from 'react'

import type { ProviderOptions } from 'types'

const CroodsContext = createContext({})

type CroodsProviderOptions = ProviderOptions & {
  children: React.ReactNode
}
const CroodsProvider = ({
  children,
  ...options
}: CroodsProviderOptions): JSX.Element => {
  return (
    <CroodsContext.Provider value={options}>{children}</CroodsContext.Provider>
  )
}

const useBaseOptions = (): ProviderOptions => useContext(CroodsContext)

export { useBaseOptions, CroodsContext, CroodsProvider }
export type { CroodsProviderOptions }
