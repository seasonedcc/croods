---
id: cauth-intro
title: Croods-Auth Introduction
---

Croods-auth is another layer of abstraction on top of Croods, providing you with a ready-to-use solution for user authentication and permission control.

#### Installation

```
yarn add croods croods-auth@^2
```

Bellow is a simple example of its usage with [@reach/router](https://reach.tech/router):

```jsx
// App.js

import { CroodsProvider } from 'croods'
import { AuthProvider, Auth, authHeaders, saveHeaders } from 'croods-auth'

export default props => (
  <CroodsProvider
    headers={authHeaders}
    handleResponseHeaders={saveHeaders}
    baseUrl="https://foo.bar"
  >
    <AuthProvider>
      <Router>
        <Auth
          Component={SomeBlockedPage}
          path="/"
          unauthorized={() => redirect('/sign-in')}
        />
        <SignIn path="/sign-in" />
      </Router>
    </AuthProvider>
  </CroodsProvider>
)
```

#### Main concepts to notice here:

- **`saveHeaders`:** Provides Croods with a method to save the headers after every request. This is good for when your token will be regenerated on every request.
- **`authHeaders`:** Provides Croods with headers from the storage for usage on Croods requests. Eg.: `Auth-Token`, `Uid`, `Client`, `Token-Type` and `Expiry`.
- **`AuthProvider`:** This Provider authenticate the user and makes it available through the context. You can use `useUserFromContext` to use this data without making new authentication requests.
- **`Auth`:** Used for checking permissions required for a component.

And then we implement our SignIn page:

```jsx
import { useSignIn } from 'croods-auth'

const Input = ({ name, label = name, ...props }) => (
  <div className="form-group">
    <label htmlFor={name}>{label}</label>
    <input {...props} className="form-control" id={name} />
  </div>
)

export default props => {
  const [{ signingIn, error, ...config }] = useSignIn({
    afterSuccess: () => navigate(`/home`),
  })
  
  return (
    <form {...config.formProps}>
      <h2>Sign In</h2>
      <Input {...config.emailProps} label="Email address" />
      <Input {...config.passwordProps} />
      <button type="submit" className="btn btn-primary">
        {signingIn ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  );
}
```

So, here you can notice that useSignIn provides you with objects to use as props
in your form and inputs (`formProps`, `emailProps` and `passwordProps`), along with the request state (`signingIn`).

We can also notice it is configured as an usual [`useCroods`](/docs/use-croods-api) hook.

There are hooks available for all usual authentication operations (sign up, edit profile, etc).
