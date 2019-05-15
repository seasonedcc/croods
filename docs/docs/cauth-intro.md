---
id: cauth-intro
title: Introduction
---

Croods-auth is another layer of abstraction on top of Croods, providing you with a ready-to-use solution for user authentication and permission control.

Bellow is a simple example of its usage:

```
// src/App.js
// [...]

import { CroodsProvider } from 'croods-light'
import { Auth, authHeaders } from 'croods-light-auth'

export default props => (
  <CroodsProvider
    headers={authHeaders}
    baseUrl="https://foo.bar"
  >
    <Router>
      <Auth
        Component={SomeBlockedPage}  
        path="/home"
        unauthorized={redirect('/sign-in')}
      />
      <SignIn path="/sign-in" />
    </Router>
  </CroodsProvider>
)
```
Main concepts to notice here:
- `Auth` Component: Used for checking permissions required for a path.
- `authHeaders`: Provides Croods with right headers

And inside the SignIn:
```
// src/SignIn
// [...]

import { useSignIn } from 'croods-light-auth'

export default props => {
  const [
    { signingIn, error, emailProps, passwordProps, formProps },
  ] = useSignIn({
    afterSuccess: () => {
      navigate(`/home`)
    },
  })
  return (
    <form {...formProps}>
      <h2>Sign In</h2>
      <Input {...emailProps} label="Email address" />
      <Input {...passwordProps} error={error} />
      <button type="submit" className="btn btn-primary">
        {signingIn ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  )
}
```
So, here you can notice that useSignIn provides you with objects to use as props
in your form and inputs. There are hooks available for all other operations (sign up, edit profile,etc)
