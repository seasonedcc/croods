import { useState, useEffect } from 'react'
import forEach from 'lodash/forEach'

type WithStore<T> = T extends (...a: [Store<T>, ...infer P]) => infer R
  ? (...a: P) => R
  : never
type ObjWithStore<T extends Record<string, any>> = {
  [K in keyof T]: WithStore<T[K]>
}
type Listener = [string | undefined, React.Dispatch<any>]
type Store<T = Record<string, any>, U = Record<string, any>> = {
  setState(t: Record<string, unknown>, p?: string): void
  actions?: ObjWithStore<T>
  state: U
  listeners?: Listener[]
}

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

type UseGlobal<T extends Record<string, any>, U extends Record<string, any>> = (
  context?: string,
) => [U, ObjWithStore<T>]
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

export { useStore } // TODO: avoid useHook naming patter bc this is not a hook
export type { Listener, Store, UseGlobal }
