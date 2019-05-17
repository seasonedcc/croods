---
id: cauth-delete-account
title: useDeleteAccount
---

**Format:** `options => [state, delete]`

This hook returns a set of utilities for building a delete account control.

## Returned values

```
const [{
    currentUser, // it may contain the current user
    deleting, // true when executing the request
    error, // error string in the request
  },
  deleteFunction // executes the delete request
] = useDeleteAccount()
```

## Recommended configuration

Same as [`useSignIn`](/docs/cauth-sign-in#recommended-configuration). You can also set your [`storage`](/docs/cauth-headers#storage) method and [`storageKey`](/docs/cauth-headers#storagekey), because Croods-auth will use those values to clear the headers from your `localStorage` after the delete request succeeds.

```
import { AsyncStorage } from 'react-native'

const tuple = useSignOut({
  storage: AsyncStorage,
  storageKey: 'mySp3ci4lK3y',
})
```

You **also** probably want to redirect the user by setting a [`afterSuccess`](/docs/croods-provider-api#aftersuccess) to this hook.

## Usage samples

```
const [{ currentUser, deleting }, deleteAccount] = useDeleteAccount()
const text = deleting ? 'Deleting account...' : 'Delete account'
return (
  <button onClick={() => {
    const message = `Are you sure you want to delete ${currentUser.name}?`
    const userAgreed = confirm(message)
    userAgreed && deleteAccount()
  }}>
    {text}
  </button>
)
```
