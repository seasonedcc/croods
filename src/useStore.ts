import { useState, useEffect } from 'react'
import forEach from 'lodash/forEach'
import type { Listener, ObjWithStore, Store } from './typeDeclarations'

function setState(
  this: Store,
  newState: Record<string, any>,
  updateContext?: string,
) {
  this.state = { ...this.state, ...newState }
  this.listeners &&
    this.listeners.forEach(([context, listener]: Listener) => {
      updateContext === context && listener(this.state)
    })
}

function useCustom(
  this: Store,
  context?: string,
): [Record<string, any>, Record<string, any>] {
  const [, newListener] = useState()
  useEffect(() => {
    this.listeners && this.listeners.push([context, newListener])
    return () => {
      this.listeners = this.listeners
        ? this.listeners.filter(
            ([, listener]: Listener) => listener !== newListener,
          )
        : []
    }
  }, [newListener, context])
  return [this.state, this.actions || {}]
}

function associateActions(store: Store, actions: Record<string, any>) {
  const associatedActions: Record<string, any> = {}
  forEach(actions, (value, key) => {
    if (typeof value === 'function') {
      associatedActions[key] = value.bind(null, store)
    }
  })
  return associatedActions
}

export type UseGlobal<
  T extends Record<string, any>,
  U extends Record<string, any>,
> = (context?: string) => [U, ObjWithStore<T>]
function useStore<T, U extends Record<string, any> = Record<string, any>>(
  actions: T,
  initialState: U,
): UseGlobal<T, U> {
  if (!actions) {
    throw new Error('You need to set up some actions')
  }
  const store: Store = {
    state: initialState || {},
    listeners: [],
    setState: () => null,
  }
  store.setState = setState.bind(store)
  store.actions = associateActions(store, actions)
  return useCustom.bind(store) as UseGlobal<T, U>
}

export default useStore
