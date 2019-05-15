---
id: cauth-headers
title: authHeaders
---

This method accepts two properties and is responsible to return the [`headers`](/docs/croods-provider-api#headers) for authorized requests. It'll get those headers from your storage option, assuming that they were saved already - as the [other hooks](/docs/) already do.

| Property                  |  Type  | Required |                                           Default                                           |
| ------------------------- | :----: | :------: | :-----------------------------------------------------------------------------------------: |
| [storage](#storage)       |  Func  |    ✔     | [localStorage](https://developer.mozilla.org/pt-BR/docs/Web/API/Window/Window.localStorage) |
| [storageKey](#storagekey) | string |    ✔     |                                     `"authCredentials"`                                     |

## storage

**Function:** The method to store all the headers information locally (or elsewhere).

The default methods is the web's own [localStorage](https://developer.mozilla.org/pt-BR/docs/Web/API/Window/Window.localStorage).

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
