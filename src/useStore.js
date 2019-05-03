import { useState, useEffect } from 'react'
import forEach from 'lodash/forEach'

function setState(newState, updateContext) {
  this.state = { ...this.state, ...newState }
  this.listeners.forEach(([context, listener]) => {
    updateContext === context && listener(this.state)
  })
}

function setGlobalState(newState) {
  this.state = { ...this.state, ...newState }
  this.listeners.forEach(([, listener]) => {
    listener(this.state)
  })
}

function useCustom(context) {
  const [, newListener] = useState()
  useEffect(() => {
    this.listeners.push([context, newListener])
    return () => {
      this.listeners = this.listeners.filter(
        ([, listener]) => listener !== newListener,
      )
    }
  }, [newListener, context])
  return [this.state, this.actions]
}

function associateActions(store, actions) {
  const associatedActions = {}
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

export default (actions, initialState = {}) => {
  const store = { state: initialState, listeners: [] }
  store.setState = setState.bind(store)
  store.setGlobalState = setGlobalState.bind(store)
  store.actions = associateActions(store, actions)
  return useCustom.bind(store)
}
