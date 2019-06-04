---
id: cauth-headers
title: Dealing with headers
---

# authHeaders

This method accepts two properties and is responsible to return the [`headers`](/docs/croods-provider-api#headers) for authorized requests. It'll get those headers from your storage option, assuming that they were saved already - as the [other hooks](/docs/cauth-sign-in) already do.

| Property                  |  Type  | Required |                                           Default                                           |
| ------------------------- | :----: | :------: | :-----------------------------------------------------------------------------------------: |
| [storage](#storage)       |  Func  |    ✔     | [localStorage](https://developer.mozilla.org/pt-BR/docs/Web/API/Window/Window.localStorage) |
| [storageKey](#storagekey) | string |    ✔     |                                     `"authCredentials"`                                     |

## storage

**Function:** The method to store all the headers information locally (or elsewhere).

The default methods is the browser's own [localStorage](https://developer.mozilla.org/pt-BR/docs/Web/API/Window/Window.localStorage).

In order for this function to work it must have the following format:

```
const storage = {
  getItem: keyString => (),
  setItem: (keyString, dataString) => (),
  // the object will be converted to JSON string
}
```

Therefore this is how to save headers on browser cookies:

```
import cookies from 'js-cookie'

const storage = {
  getItem: cookies.get,
  setItem: cookies.set,
}

<CroodsProvider headers={authHeaders({ storage })}>
  <MyApp />
</CroodsProvider>
```

And this is how you'd use it on react-native:

```
import { AsyncStorage } from 'react-native'

<CroodsProvider headers={authHeaders({ storage: AsyncStorage })}>
  <MyApp />
</CroodsProvider>
```

## storageKey

**Default:** `"authCredentials"`

**String:** The key to store the headers on your storage method.

```
<CroodsProvider headers={authHeaders({ storageKey: 'mySp3ci4lStor3K3y' })}>
  <MyApp />
</CroodsProvider>
```

---

# saveHeaders

This method receives the `response` from [`handleResponseHeaders`](/docs/croods-provider-api#handleresponseheaders) and saves them in your localStorage. It can be configured for other storage options as described below.

```
import { saveHeaders } from 'croods-auth'

<CroodsProvider handleResponseHeaders={saveHeaders}>
  <MyApp />
</CroodsProvider>
```

And this is how you'd use it on react-native:

```
import { saveHeaders } from 'croods-auth'
import { AsyncStorage } from 'react-native'

<CroodsProvider handleResponseHeaders={({ headers }) => {
  saveHeaders(headers, { storage: AsyncStorage })
}}>
  <MyApp />
</CroodsProvider>
```


## Basic setup

So, joining the two methods above is the solution for handling the saving and retrieving of auth tokens for every Croods request:

```
import { authHeaders, saveHeaders } from 'croods-auth'
import { AsyncStorage } from 'react-native'

const options = {
  storage: AsyncStorage,
  storageKey: 'my-localstorage-key',
}

<CroodsProvider
  headers={authHeaders(options)}
  handleResponseHeaders={({ headers }) => {
    saveHeaders(headers, options)
  }
}>
  <MyNativeApp />
</CroodsProvider>
```
