import React, { createContext, useContext } from 'react'
import type { ProviderOptions } from './types'

const CroodsContext = createContext({})

type Provider = React.FC<ProviderOptions>
const CroodsProvider: Provider = ({ children, ...options }): JSX.Element => {
  return (
    <CroodsContext.Provider value={options}>{children}</CroodsContext.Provider>
  )
}


export { CroodsContext, CroodsProvider }
export type { Provider }
