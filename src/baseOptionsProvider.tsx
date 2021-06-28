import React, { createContext, useContext } from 'react'

import type { ProviderOptions } from 'types'

const CroodsContext = createContext({})

type CroodsProviderOptions = React.FC<ProviderOptions>
const CroodsProvider: CroodsProviderOptions = ({ children, ...options }) => {
  return (
    <CroodsContext.Provider value={options}>{children}</CroodsContext.Provider>
  )
}

const useBaseOptions = (): ProviderOptions => useContext(CroodsContext)

export { useBaseOptions, CroodsContext, CroodsProvider }
export type { CroodsProviderOptions, ProviderOptions }
