---
id: croods-provider-api
title: CroodsProvider
---

**Important:** This purpose of this component is to set defaults to your project.

Every one of the props below can/should be overriden by the usage of `<Fetch />` and `useCroods`.

The table bellow presents all the props you can pass to the Provider. Further down the page are detailed descriptions of each.

(Click on any name to navigate directly to its information.)

| Property                                    |    Type     | Required | Default | Example |
| ------------------------------------------- | :---------: | :------: | :-----: | :-----: |
| [baseUrl](#baseurl)                         |   String    |    ✔     |    -    |         |
| [credentials](#credentials)                 |   object    |          |    -    |         |
| [cache](#cache)                             |    Bool     |          |    -    |         |
| [debugActions](#debugactions)               |    Bool     |          |    -    |         |
| [debugRequests](#debugrequests)             |    Bool     |          |    -    |         |
| [headers](#headers)                         | Func/object |          |    -    |         |
| [afterResponse](#afterResponse)             |    Func     |          |    -    |         |
| [afterSuccess](#aftersuccess)               |    Func     |          |    -    |         |
| [afterFailure](#afterfailure)               |    Func     |          |    -    |         |
| [paramsParser](#paramsparser)               |    Func     |          |    -    |         |
| [paramsUnparser](#paramsunparser)           |    Func     |          |    -    |         |
| [parseResponse](#parseresponse)             |    Func     |          |    -    |         |
| [parseFetchResponse](#parsefetchresponse)   |    Func     |          |    -    |         |
| [parseListResponse](#parselistresponse)     |    Func     |          |    -    |         |
| [parseInfoResponse](#parseinforesponse)     |    Func     |          |    -    |         |
| [parseSaveResponse](#parsesaveresponse)     |    Func     |          |    -    |         |
| [parseCreateResponse](#parsecreateresponse) |    Func     |          |    -    |         |
| [parseUpdateResponse](#parseupdateresponse) |    Func     |          |    -    |         |
| [renderError](#rendererror)                 |    Func     |          |    -    |         |
| [renderEmpty](#renderempty)                 |    Func     |          |    -    |         |
| [renderLoading](#renderloading)             |    Func     |          |    -    |         |
| [requestTimeout](#requesttimeout)           |   number    |          |    -    |         |
| [urlParser](#urlparser)                     |    Func     |          |    -    |         |

## baseUrl

**String:** It defines the api url which all other paths used in croods components will be relative too.

```
<CroodsProvider
  baseUrl="https://dog.ceo/api/breed/beagle"
>
  <Fetch
    name="images"
    render={...}
  />
</CroodsProvider>
```

The code above will send a `GET` request to `https://dog.ceo/api/breed/beagle/images`.

## credentials

**Object:** If you want to send credentials on your requests, just pass an object here with the following format:

```
const credentials = {
  username: 'janedoe',
  password: 's00pers3cret',
}
```

This is gonna send the `auth` property from [axios](https://github.com/axios/axios#request-config).

## cache

**Boolean:** Pass `true` if you want to cache your requests, which means that if you unmount and mount again a component that fetches data through Croods and you already have equivalent data on `info` or `list`, it will use the old data and avoid a request.

```
<Fetch
  name="auth"
  cache
  render={currentUser => currentUser.name}
/>
```

Use it wisely, caching is source of weird bugs and awesome speed ;). We recommend not setting it as default to your whole app, but to be used by components (on `Fetch` and `useCroods`).

## debugActions

**Boolean:** It logs all the [Croods Actions](/docs/the-actions) to your JS Console. We recommend using it on `process.env.NODE_ENV === 'development'`.

Check out the [debugging section](/docs/debugging) if you want to read more about it.

```
<CroodsProvider baseUrl="https://dog.ceo/api/breed/beagle" debugActions>
  <MyApp />
</CroodsProvider>
```

## debugRequests

**Boolean:** It logs all the API requests to your JS Console. We recommend using it on `process.env.NODE_ENV === 'development'`.

Check out the [debugging section](/docs/debugging) if you want to read more about it.

```
<CroodsProvider baseUrl="https://dog.ceo/api/breed/beagle" debugRequests>
  <MyApp />
</CroodsProvider>
```

## headers

**Object|Function:** use this prop to send headers along with your requests.

Croods already has some default headers that will be merged/overriden by the ones you provide here. These are our defaults:

```
{ 'Accept': 'application/json', 'Content-Type': 'application/json' }
```

You can send new headers as an object:

```
<CroodsProvider headers={{ 'Access-Token': 08f90ds8f90sd }} />
// { 'Accept': 'application/json', 'Content-Type': 'application/json', 'Access-Token': 08f90ds8f90sd }
```

Or you can send a function, even a Promise that should return an object:

```
const getHeaders = async () => {
  const stored = await AsyncStorage.getItem('authCredentials')
  const headers = JSON.parse(stored)
  return {
    'Access-Token': headers.accessToken,
    'Token-Type': headers.tokenType,
  }
}

<CroodsProvider headers={getHeaders} />
```

## afterResponse

## afterSuccess

## afterFailure

## paramsParser

## paramsUnparser

## parseResponse

## parseFetchResponse

## parseListResponse

## parseInfoResponse

## parseSaveResponse

## parseCreateResponse

## parseUpdateResponse

## persistHeaders

## persistHeadersKey

## persistHeadersMethod

## renderError

## renderEmpty

## renderLoading

## requestTimeout

## urlParser
