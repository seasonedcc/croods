---
id: cauth-auth-component
title: Auth Component
---

This is a helper component that makes it easier to protect a page from unauthorized access. It receives the following props, and forwards to the component the `currentUser` and `setCurrentUser` as props, along withany other props you may pass it.

| Property                      |  Type   | Required |          Default          |
| ----------------------------- | :-----: | :------: | :-----------------------: |
| [Component](#component)       |  Func   |    ✔     |             -             |
| [unauthorized](#unauthorized) |  Func   |    ✔     |             -             |
| [unauthorize](#unauthorize)   |  Func   |          | currentUser !== undefined |
| [authorizing](#authorizing)   | Element |          |  () => 'Authorizing...'   |

## Component

This is the component being protected. Every other prop passed to `Auth` will be forwarded to this component:

#### Usage

```
import { Auth } from 'croods-auth'

const MyComponent = ({ title, currentUser, setCurrentUser }) => (
  <div>
    <h1>{title} - {currentUser.name}</h1>
    <button onClick={() => setCurrentUser(null)}>
      {`Remove the current user` /* and thus we'll be redirected */}
    </button>
  </div>
)

const App = () => (
  <Auth
    title="This is going to MyComponent"
    Component={MyComponent}
    unauthorized={() => navigate('/sign-in')}
  />
)
```

## unauthorized

**Format:** `object? => void`

**Function:** It will be called whenever `Auth` can not get the `currentUser` or validate the token.

Use it to dispatch some side effect, like redirecting users that aren't logged in.

This function will also be called when `unauthorize` returns `true`. Then the `currentUser`, if existent, will be passed to this function.

```
<Auth
  unauthorized={async () => {
    await navigate('/sign-in?redirect_to=' + window.location.pathname)
    alert('You are not logged in!')
  }}
  Component={MyComponent}
/>
```

## unauthorize

**Format:** `object? => void`

**Function:** If this function is set, it will be called with the `currentUser`. If it returns `true`, the `unauthorized` function will be called.

```
<Auth
  unauthorize={user => !user.admin}
  unauthorized={async () => {
    await navigate('/')
    alert('Only admins can access that page!')
  }}
  authorizing="Checking admin role..."
  Component={Dashboard}
/>
```

## authorizing

**React Element:** It will be rendered while your user is being validated.

#### Usage:

```
import { Auth } from 'croods-auth'

<Auth
  authorizing={<Loading />}
  Component={MyComponent}
/>
```
