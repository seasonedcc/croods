---
id: use-store-api
title: useStore
---

This is the global state manager used by Croods. It is not a hook, even though its name starts with "use", it is a hook maker.

You can use it to create a hook with access to the global state (separated from croods).

```javascript
// src/useGlobal.js
import { useStore } from 'croods'
const initialState = {
  menuOpen: false,
}
const actions = {
  toggleMenu: (store) => {
    store.setState({ menuOpen: !store.state.menuOpen })
  },
  doSearch: (store, searchTerm) => {
    store.setState({ searchTerm })
  },
  clearSearch: (store) => {
    store.setState({ searchTerm: undefined })
  },
}
export default useStore(actions, initialState)
```

You can use it to access the entire state and all actions, e.g:

```jsx
import useGlobal from './useGlobal'
const MyComponent = () => {
  const [{ menuOpen, searchTerm }, { clearSearch, doSearch, toggleMenu }] = useGlobal()
  return (
    <div onClick={toggleMenu}>
      <input value={searchTerm} onChange={ev => doSearch(ev.target.value)} />
      <button onClick={clearSearch}>Reset</button>
    </div>
  )
}
```

Or you can give a name to each action, and use the same hook with this name to access this specific part of the state.

```javascript
// src/useGlobal.js

//(...)

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

//(...)
```

For example, if you want to use only the `searchChanges` piece:

```
const [state, actions] = useGlobal('searchChanges')
return <input value={state.searchTerm} onChange={ev => actions.doSearch(ev.target.value)} />
```

The use with names is important for performance. If you use `useGlobal()` without selecting the piece you have interest on, every change in any of those states (even the ones that you aren't using) would cause a rerender of your component.
