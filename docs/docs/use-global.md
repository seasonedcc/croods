---
id: use-global
title: The useGlobal hook
---

Croods has a global state manager that can be of use if there's need for manipulating application state globally.

With it you can save and request information from this store without needing to tamper with Croods store manually, **which is highly discouraged**.

## Setting up the global state and actions

**First, you set up your global state file:**

- import `useStore` hook
- setup an initial state
- setup actions that interact with the state
- export using the hook

```js
// src/useGlobal.js

import { useStore } from 'croods'

const initialState = {
  menuOpen: false, // example
  searchTerm: undefined,
}

const actions = {
  toggleMenu: (store) => {
    // store is always passed as first parameter
    store.setState({ menuOpen: !store.state.menuOpen })
  },
  doSearch: (store, searchTerm) => {
    // you can send the second (and following) parameter on the action function, eg:
    // doSearch(searchTerm)
    store.setState({ searchTerm })
  },
  clearSearch: (store) => {
    store.setState({ searchTerm: undefined })
  },
}

export default useStore(actions, initialState)
```

## Using the hook

**Then, you call the `useGlobal` hook from anywhere:**

- import the hook
- from it you can access the state itself and the actions to manipulate it

```js
// src/MyComponent.js
import useGlobal from './useGlobal'

const MyComponent = () => {
  const [
    { menuOpen, searchTerm },
    { clearSearch, doSearch, toggleMenu },
  ] = useGlobal()

  return (
    <div onClick={toggleMenu}>
      <input value={searchTerm} onChange={(ev) => doSearch(ev.target.value)} />
      <button onClick={clearSearch}>Reset</button>
    </div>
  )
}
```

**Important**: any change in `useGlobal` store will rerender all components that are using `useGlobal`.

If you want to render specific components based on which part of the state they need to update (Croods already does that based on `name + stateId`), you can set a second string to `useGlobal` actions and, when the hook is called, pass this string as parameter:

```js
// src/useGlobal.js

const actions = {
  toggleMenu: (store) => {
    store.setState({ menuOpen: !store.state.menuOpen }, 'menuChanges')
  },
  doSearch: (store, searchTerm) => {
    store.setState({ searchTerm }, 'searchChanges')
  },
  clearSearch: (store) => {
    store.setState({ searchTerm: undefined }, 'searchChanges')
  },
}
```

```js
// src/MyComponent.js

const [state, actions] = useGlobal('searchChanges')
return (
  <input
    value={state.searchTerm}
    onChange={(ev) => actions.doSearch(ev.target.value)}
  />
)
```

That way you can manage an application-wise state without tampering with Croods state.
