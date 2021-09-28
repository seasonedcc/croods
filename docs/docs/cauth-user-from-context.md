---
id: cauth-user-from-context
title: useUserFromContext
---

**Format:** `() => [state, setCurrentUser]`

This is the hook that allows you to access the AuthProvider context. The return follows the same format of [`useCurrentUser`](/docs/cauth-current-user). It's important to highlight that this hook doesn't make a request, it only returns the content of the AuthProvider context.

The use of this hook requires the use of [AuthProvider](/docs/cauth-auth-provider) up in the tree. If not, it will throw an error.


## Returned values

```jsx
const [{
    currentUser, // it may contain the current user
    validating, // true when validating the token
    status, // it can be either 'visitor' | 'loggedIn' | 'pending'
    error, // The message in case of error
  },
  setCurrentUser, // function to change some user property on client side
] = useUserFromContext()
```

## Usage samples

The return follows the same format of `useCurrentUser`, and the usage is the same.

#### Show a spinner while checking for the user

```jsx
const [{ currentUser, validating, status }] = useUserFromContext()
return status === 'pending'
  ? <Spinner />
  : <h1>{status === 'visitor' ? 'Hello foreigner' : currentUser.name}</h1>
```

#### Change some property from the currentUser

```jsx
const [{ currentUser }, setCurrentUser] = useUserFromContext()
const [, { save }] = useCroods({
    name: 'posts',
    afterSuccess: () => setCurrentUser({ postsCount: currentUser.postsCount + 1 }, true)
})

onSubmit = async data => {
  const saved = await save()({ ...data, authorId: currentUser.id })
}
```

Notice we are using `setCurrentUser`'s second parameter `true`, because this method is a [`setInfo`](/docs/the-actions#setinfo) and we want to merge the data with what we already have.
