---
id: cauth-sign-out
title: useSignOut
---

**Format:** `options => [state, signOut]`

This hook returns a set of utilities for building a sign out control.

## Returned values

```
const [{
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

The returned function is a Promise and can be awaited. Keep in mind that `afterSuccess` can still be configured though.

```
const [{ currentUser }] = useCurrentUser()
const [{ signingOut }, signOut] = useSignOut({
  afterSuccess: () => navigate('/sign-in')
})
const text = signingOut ? 'Signing out...' : 'Sign out'
return (
  <div>
    <h1>Signed in as {currentUser.name}</h1>
    <button onClick={async () =>
      await signOut()
      alert('You are now signed out!')
    }>
      {text}
    </button>
  </div>
)
```

#### What if my app breaks when I log out?

Sometimes, your UI is expecting to always have a `currentUser` and will break otherwise. This can be tricky given that your app will rerender everytime anything changes in the Croods state and it might render without the user, before executing the .

If this is happening to you, dispatch the `signOut` function right after redirecting the user:

```
const [{ currentUser }] = useCurrentUser()
const [{ signingOut }, signOut] = useSignOut()
return (
  <div>
    <h1>Signed in as {currentUser.name}</h1>
    <button onClick={async () =>
      await navigate('/sign-in')
      await signOut()
      alert('You are now signed out!')
    }>
      Sign out
    </button>
  </div>
)
```
