import React from 'react'
import useGlobalHook from 'use-global-hook'

import actions from '../actions'

const useGlobal = useGlobalHook(React, {}, actions)

export default useGlobal
