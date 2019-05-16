---
id: cauth-intro
title: Croods-Auth Introduction
---

Croods-auth is another layer of abstraction on top of Croods, providing you with a ready-to-use solution for user authentication and permission control.

Bellow is a simple example of its usage with [@reach/router](https://reach.tech/router):

```
import { CroodsProvider } from 'croods'
import { Auth, authHeaders } from 'croods-auth'

export default props => (
  <CroodsProvider
    headers={authHeaders}
    baseUrl="https://foo.bar"
  >
    <Router>
      <Auth
        Component={SomeBlockedPage}
        path="/"
        unauthorized={() => redirect('/sign-in')}
      />
      <SignIn path="/sign-in" />
    </Router>
  </CroodsProvider>
)
```

#### Main concepts to notice here:

- **`authHeaders`:** Provides Croods with headers from the storage for usage on Croods requests. Eg.: `Auth-Token`, `Uid`, `Client`, `Token-Type` and `Expiry`.
- **`Auth`:** Used for checking permissions required for a component.

And then we implement our SignIn page:

```
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
