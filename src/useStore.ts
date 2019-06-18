import { useState, useEffect } from 'react'
import forEach from 'lodash/forEach'
import { CroodsState, Store } from './types'

function setState(this: Store, newState: CroodsState, updateContext?: string) {
  this.state = { ...this.state, ...newState }
  this.listeners &&
    this.listeners.forEach(([context, listener]: any) => {
      updateContext === context && listener(this.state)
    })
}

function setGlobalState(this: Store, newState: CroodsState) {
  this.state = { ...this.state, ...newState }
  this.listeners &&
    this.listeners.forEach(([, listener]: any) => {
      typeof listener === 'function' && listener(this.state)
    })
}

function useCustom(this: Store, context?: string) {
  const [, newListener] = useState()
  useEffect(() => {
    this.listeners && this.listeners.push([context, newListener])
    return () => {
      this.listeners = this.listeners
        ? this.listeners.filter(([, listener]: any) => listener !== newListener)
        : []
    }
  }, [newListener, context])
  return [this.state, this.actions]
}

function associateActions(store: Store, actions: any) {
  const associatedActions: any = {}
  forEach(actions, (value, key) => {
    if (typeof value === 'function') {
      associatedActions[key] = value.bind(null, store)
    }
    if (typeof value === 'object') {
      associatedActions[key] = associateActions(store, value)
    }
  })
  return associatedActions
}

export default (actions: object, initialState = {}) => {
  const store: Store = {
    state: initialState,
    listeners: [],
    setState: () => null,
  }
  store.setState = setState.bind(store)
  store.setGlobalState = setGlobalState.bind(store)
  store.actions = associateActions(store, actions)
  return useCustom.bind(store)
}
