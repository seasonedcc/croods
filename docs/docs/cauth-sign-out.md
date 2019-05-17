---
id: cauth-sign-out
title: useSignOut
---

**Format:** `options => [state, signOut]`

This hook returns a set of utilities for building a sign out control.

## Returned values

```
const [{
    currentUser, // it may contain the current user
    signingOut, // true when executing the request
    error, // error string in the request
  },
  signOutFunction, // executes the sign out request and clears the current user
] = useSignOut()
```

## Recommended configuration

Same as [`useSignIn`](/docs/cauth-sign-in#recommended-configuration). You can also set your [`storage`](/docs/cauth-headers#storage) method and [`storageKey`](/docs/cauth-headers#storagekey), because Croods-auth will use those values to clear the headers from your `localStorage` after the sign out request succeeds.

```
import { AsyncStorage } from 'react-native'

const tuple = useSignOut({
  storage: AsyncStorage,
  storageKey: 'mySp3ci4lK3y',
})
```

## Usage samples

#### Build a simple sign out button

The returned function is going to receive a callback that will run after signing out. Keep in mind that `afterSuccess` can still be configured though.

```
const [{ currentUser, signingOut }, signOut] = useSignOut()
const text = signingOut ? 'Signing out...' : 'Sign out'
return (
  <div>
    <h1>Signed in as {currentUser.name}</h1>
    <button onClick={() =>
      signOut(() => navigate('/sign-in'))
    }>
      {text}
    </button>
  </div>
)
```
