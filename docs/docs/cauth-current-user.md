---
id: cauth-current-user
title: useCurrentUser
---

**Format:** `options => [state, setCurrentUser]`

This hook returns your current logged user, and a function to change it (on client-side).

It checks if there's already a currentUser in the [global state](/docs/the-state) and otherwise it'll validate your stored token, get the user and [**`cache`**](/docs/croods-provider-api#cache) for other components using this hook.

## Returned values

```
const [{
    currentUser, // it may contain the current user
    validating, // true when validating the token
    status, // it can be either 'visitor' | 'logged' | 'pending'
  },
  setCurrentUser, // function to change some user property on client side
] = useCurrentUser()
```

## Recommended configuration

It is **important** that you provide an [`afterFailure`](/docs/croods-provider-api#afterfailure) with a plan to when there's no currentUser. For instance:

```
const [{ currentUser }] = useCurrentUser({
  afterFailure: () => navigate('/sign-in'),
})
```

## Usage samples

#### Show a spinner while checking for the user

```
const [{ currentUser, validating, status }] = useCurrentUser()
return status === 'pending'
  ? <Spinner />
  : <h1>{status === 'visitor' ? 'Hello foreigner' : currentUser.name}</h1>
```

#### Change some property from the currentUser

```
const [{ currentUser }, setCurrentUser] = useCurrentUser()
const [, { save }] = useCroods({ name: 'posts' })
onSubmit = async data => {
  const saved = await save()({ ...data, author: currentUser.id })
  if (saved) {
    setCurrentUser({ postsCount: currentUser.postsCount + 1 }, true)
  }
}
```

Notice we are using `setCurrentUser`'s second parameter `true`, because this method is a [`setInfo`](/docs/the-actions#setinfo) and we want to merge the data with what we already have.

#### Disable the user cache

**Important:** the current user is **cached by default**. When a request changes the user, or if this is giving you trouble, use it disabling the cache like so:

```
const [{ currentUser }] = useCurrentUser({ cache: false })
```
