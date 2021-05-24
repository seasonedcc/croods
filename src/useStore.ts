import { useState, useEffect } from 'react'
import forEach from 'lodash/forEach'
import type {
  Action,
  Actions,
  BindedAction,
  GlobalState,
  Listener,
  Store,
} from './typeDeclarations'

function setState(this: Store, newState: GlobalState, updateContext?: string) {
  this.state = { ...this.state, ...newState }
  this.listeners &&
    this.listeners.forEach(([context, listener]: Listener) => {
      updateContext === context && listener(this.state)
    })
}

function useCustom(this: Store, context?: string): [GlobalState, Actions] {
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
  return [this.state, this.actions!]
}

function associateActions(store: Store, actions: Actions) {
  const associatedActions: Actions = {}
  forEach(actions, (value, key) => {
    if (typeof value === 'function') {
      associatedActions[key] = value.bind(null, store)
    }
  })
  return associatedActions
}

export type UseStore = (
  a: Record<string, Action>,
  i: GlobalState,
) => (c?: string) => [GlobalState, Record<string, BindedAction<Action>>]
const useStore: UseStore = (actions, initialState = {}) => {
  if (!actions) {
    throw new Error('You need to set up some actions')
  }
  const store: Store = {
    state: initialState,
    listeners: [],
    setState: () => null,
  }
  store.setState = setState.bind(store)
  store.actions = associateActions(store, actions)
  return useCustom.bind(store)
}

export default useStore
