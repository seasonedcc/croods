---
id: cauth-auth-provider
title: Auth Provider
---

This is the provider component that will make the current user available through the [`useUserFromContext`](/docs/cauth-user-from-context). Using this component and it's hook make easier to avoid multiple requests validating the token.
Under the hood, this component uses the [`useCurrentUser`](/docs/cauth-current-user) and make the returned value available.

#### Usage

```
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
      <MyComponents>
    </AuthProvider>
  </CroodsProvider>
)
```
