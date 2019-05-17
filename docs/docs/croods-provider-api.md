---
id: croods-provider-api
title: CroodsProvider
---

**Important:** The purpose of this component is to set defaults to your project.

Every one of the props below can be overriden by the usage of `<Fetch />`, `useCroods` or any Croods action.

The table bellow presents all the props you can pass to the Provider. Further down the page there are detailed descriptions of each.

(Click on any name to navigate directly to its information.)

| Property                                    |    Type     | Required |                        Default                         |
| ------------------------------------------- | :---------: | :------: | :----------------------------------------------------: |
| [baseUrl](#baseurl)                         |   String    |    ✔     |                           -                            |
| [credentials](#credentials)                 |   object    |          |                           -                            |
| [cache](#cache)                             |    Bool     |          |                         false                          |
| [debugActions](#debugactions)               |    Bool     |          |                         false                          |
| [debugRequests](#debugrequests)             |    Bool     |          |                         false                          |
| [headers](#headers)                         | Func/object |          |                           -                            |
| [afterResponse](#afterresponse)             |    Func     |          |                           -                            |
| [afterSuccess](#aftersuccess)               |    Func     |          |                           -                            |
| [afterFailure](#afterfailure)               |    Func     |          |                           -                            |
| [after4xx](#after4xx)                       |    Func     |          |                           -                            |
| [after5xx](#after5xx)                       |    Func     |          |                           -                            |
| [paramsParser](#paramsparser)               |    Func     |          | [snakeCase](https://lodash.com/docs/4.17.11#snakeCase) |
| [paramsUnparser](#paramsunparser)           |    Func     |          | [camelCase](https://lodash.com/docs/4.17.11#camelCase) |
| [parseResponse](#parseresponse)             |    Func     |          |               response => response.data                |
| [parseFetchResponse](#parsefetchresponse)   |    Func     |          |                           -                            |
| [parseListResponse](#parselistresponse)     |    Func     |          |                           -                            |
| [parseInfoResponse](#parseinforesponse)     |    Func     |          |                           -                            |
| [parseSaveResponse](#parsesaveresponse)     |    Func     |          |                           -                            |
| [parseCreateResponse](#parsecreateresponse) |    Func     |          |                           -                            |
| [parseUpdateResponse](#parseupdateresponse) |    Func     |          |                           -                            |
| [parseErrors](#parseerrors)                 |    Func     |          |                           -                            |
| [renderError](#rendererror)                 |    Func     |          |                           -                            |
| [renderEmpty](#renderempty)                 |    Func     |          |                           -                            |
| [renderLoading](#renderloading)             |    Func     |          |                           -                            |
| [requestTimeout](#requesttimeout)           |   number    |          |                     0 (no timeout)                     |
| [urlParser](#urlparser)                     |    Func     |          | [kebabCase](https://lodash.com/docs/4.17.11#kebabCase) |

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

Use it wisely, caching is source of weird bugs and awesome speed ;).

We recommend not setting it as default for your whole app, but to be used by components (on `Fetch` and `useCroods`).

## debugActions

**Boolean:** It logs all the [Croods Actions](/docs/the-actions) to your JS Console. We recommend using it on development environment.

Check out the [debugging section](/docs/debugging) if you want to read more about it.

```
<CroodsProvider baseUrl="https://dog.ceo/api/breed/beagle" debugActions>
  <MyApp />
</CroodsProvider>
```

## debugRequests

**Boolean:** It logs all the API requests to your JS Console. We recommend using it on development environment.

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

**Format:** `(object | Error) => void`

**Function:** This function is a callback dispatched right after every API response, before even our state has changed. It'll receive the full response object (with headers, data...) or the `Error` and should not return anything.

It is the place to add your side effects, like redirecting, analytics, showing notifications, etc.

```
const [, { save }] = useCroods({
  name: 'colors',
  afterResponse: response => response.data
    ? alert('Data was saved')
    : alert('Data could not be saved')
})
```

## afterSuccess

**Format:** `object => void`

**Function:** This function is a callback dispatched right after every successfull API request, right before [afterResponse](#afterresponse). It'll receive the full response object (with headers, data...) and should not return anything.

It is the place to add your side effects, like redirecting, analytics, showing notifications, etc.

```
const [, { save }] = useCroods({
  name: 'auth',
  path: 'auth/sign_in',
  afterSuccess: () => navigate('/')
})
```

## afterFailure

**Format:** `Error => void`

**Function:** This function is a callback dispatched right after every failed API request, right before [afterResponse](#afterresponse). It'll receive the `Error` and should not return anything.

It is the place to add your side effects, like redirecting, analytics, showing notifications, etc.

#### Redirecting users that fail to authenticate:

```
const [{ info: currentUser }] = useCroods({
  name: 'auth',
  path: 'auth/validate_token',
  fetchOnMount: true
  afterFailure: () => navigate('/sign-in')
})
```

#### Redirecting users when API returns 404 (see [`after4xx`](#after4xx)):

```
<Fetch
  name="todos"
  afterFailure={error => {
    if (error.response.status === 404) {
      navigate('/not-found')
    }
  }}
})
```

## after4xx

**Format:** `(number, string?, object?) => void`

**Function:** This function is a callback dispatched right after every failed API request with status 4XX (400, 404, etc), right before [afterFailure](#afterfailure). It'll receive the status code, status message and the error data.

It is a convenience function to add your side effects, like redirecting, analytics, showing notifications, etc.

#### Redirecting users that fail to authenticate:

```
const [{ info: currentUser }] = useCroods({
  name: 'auth',
  path: 'auth/validate_token',
  fetchOnMount: true,
  after4xx: (code, message, data) => {
    if (code === 403) {
      navigate('/sign-in')
    } else {
      alert(`${code} - ${message}`)
      console.log(data)
    }
  },
})
```

#### Redirecting users when API returns 404:

```
<Fetch
  name="todos"
  after4xx={code => code === 404 && navigate('/not-found')}
})
```

## after5xx

**Format:** `(number, string?, object?) => void`

**Function:** This function is a callback dispatched right after every failed API request with status 5XX (500, 503, etc), right before [afterFailure](#afterfailure). It'll receive the status code, status message and the error data.

It is a convenience function to add your side effects, like redirecting, analytics, showing notifications, etc.

#### Redirecting users when service is unavailable:

```
<Fetch
  name="todos"
  after5xx={(code, message, data) => {
    if (code === 503) {
      navigate('/service-unavailable')
    } else {
      alert(`${code} - ${message}`)
      console.log(data)
    }
  }}
/>
```

## paramsParser

**Format:** `string => string`

**Function:** This function converts the case of our data object's keys before sending them to the backend.

We assume that in our app we want to have all object's keys using `camelCase`. This is the JS standard. For instance, this is how we use to describe an object:

```
const person = { fullName: 'John Doe', homeAddress: '100 5th Ave' }
```

Most APIs, specially the ones not written in JS, expect a different standard though. For instance, the [Rails](https://rubyonrails.org/) APIs expect `snake_case`.

Given that [we](https://seasoned.cc) work mostly with Rails APIs, we left the default to [snake_case](https://lodash.com/docs/4.17.11#snakeCase) which means that `someKey` will become `some_key`. For instance:

```
const [, { save }] = useCroods({ name: 'colors' });
<button onClick={() => save()({ color: 'red', pantoneValue: '19-1664' })}>
  Create a red color
</button>

// When clicked, we will send a `POST /colors` with this data:
{ "color": "red", "pantone_value": "19-1664" }
```

Fell free to change it, depending on your API standards, by changing this prop at `<CroodsProvider>`.

## paramsUnparser

**Format:** `string => string`

**Function:** This function is used along with [paramsParser](#paramsparser) to convert the data back from the server to our frontend standard.

Given that JS standard is [`camelCase`](https://lodash.com/docs/4.17.11#snakeCase) we left it as default, which means that `some_key` will become `someKey`. For instance, our API would send the data in this format:

```
{ "id": "1", "color": "red", "pantone_value": "19-1664" }
```

And we'll have it available as:

```
const [{ info }] = useCroods({ name: 'colors', fetchOnMount: true })
console.log(info.pantoneValue) // `19-1664`
```

Fell free to change it, depending on your API standards, by changing this prop at `<CroodsProvider>`.

## parseResponse

**Format:** `object => object`

**Default:** `response => response.data`

**Function:** Extracts your `info` and `list` from the API's responses.

It will be overriden by any of the parse response methods described below.

When a successfull response comes from the server, this function will receive the whole object response with the following format:

```
{
  headers: { ... },
  data: {
    // Your API response here
  },
}
```

Then you should instruct Croods how to get the data you want on your `state.info` and `state.list` from that object.

Let's say your server uses this format:

```
{
  "status": "success",
  "message": [
    "https://images.dog.ceo/breeds/beagle/n02088364_10108.jpg",
    "https://images.dog.ceo/breeds/beagle/n02088364_10206.jpg"
  ]
}
```

Then we know our `response` object looks like this:

```
{
  headers: { ... },
  data: {
    status: 'success',
    message: [
      'https://images.dog.ceo/breeds/beagle/n02088364_10108.jpg',
      'https://images.dog.ceo/breeds/beagle/n02088364_10206.jpg',
    ],
  },
}
```

So our `parseResponse` should be:

```
<CroodsProvider
  parseResponse={response => response.data.message}
  render={...}
>
```

If your API has different patterns for different request methods, use the more specific parse response methods described below.

If you are in doubt about your server responses, read [more about `debugRequests`](/docs/debugging#debugrequests).

## parseFetchResponse

**Format:** `object => object`

**Default:** [`parseResponse`](#parseresponse)

**Function:** Extracts your `info` and `list` from the API's `GET` responses.

It has higher priority over `parseResponse` and can be overriden by `parseListResponse` and `parseInfoResponse`.

Read more about [parseResponse](#parseresponse) to understand what it does.

## parseListResponse

**Format:** `object => object`

**Default:** [`parseResponse`](#parseresponse)

**Function:** Extracts your `list` from the API's `GET` response.

It has higher priority over `parseFetchResponse` and `parseResponse`.

Read more about [parseResponse](#parseresponse) to understand what it does.

## parseInfoResponse

**Format:** `object => object`

**Default:** [`parseResponse`](#parseresponse)

**Function:** Extracts your `info` from the API's `GET` response.

It has higher priority over `parseFetchResponse` and `parseResponse`.

Read more about [parseResponse](#parseresponse) to understand what it does.

## parseSaveResponse

**Format:** `object => object`

**Default:** [`parseResponse`](#parseresponse)

**Function:** Extracts your `info` and `saved` from the API's `POST/PUT` responses.

It has higher priority over `parseResponse` and can be overriden by `parseCreateResponse` and `parseUpdateResponse`.

Read more about [parseResponse](#parseresponse) to understand what it does.

## parseCreateResponse

**Format:** `object => object`

**Default:** [`parseResponse`](#parseresponse)

**Function:** Extracts your `info` and `saved` from the API's `POST` response.

It has higher priority over `parseSaveResponse` and `parseResponse`.

Read more about [parseResponse](#parseresponse) to understand what it does.

## parseUpdateResponse

**Format:** `object => object`

**Default:** [`parseResponse`](#parseresponse)

**Function:** Extracts your `info` and `saved` from the API's `PUT` response.

It has higher priority over `parseSaveResponse` and `parseResponse`.

Read more about [parseResponse](#parseresponse) to understand what it does.

## parseErrors

**Format:** `(Error, string) => string`

**Function:** Extracts an error message from any `Error` on either [Croods actions](/docs/the-actions). This string will be stored in the respective action error state (eg: `saveError`, `infoError`, `listError`, `destroyError`).

It will replace Croods own [`defaultParseError`](https://github.com/SeasonedSoftware/croods/tree/master/src/parseErrors.js). Also, the message generated by the default parser is provided as a second argument to your function, to avoid extra work if you only want to parse specific errors, for example.

```
<Fetch
  name="todos"
  parseErrors={(error, defaultMessage) => {
    if (error.response
      && error.response.statusMessage === "Some specific Error") {
      return `Some specific message`
    }
    return defaultMessage
  }}
  renderError={error => (
    <span style={{ color: 'red' }}>
      {error}
    </span>
  )}
  render={...}
/>
```

In the example above, our `renderError` will render the string returned from our custom `parseErrors`.

## renderError

**Format:** `string => React element`

**Function:** Sets a default `renderError` for all of your `Fetch` components.

Read [more about it here](docs/fetch-api#rendererror).

## renderEmpty

**Format:** `() => React element`

**Function:** Sets a default `renderEmpty` for all of your `Fetch` components.

Read [more about it here](docs/fetch-api#renderempty).

## renderLoading

**Format:** `() => React element`

**Function:** Set a default `renderLoading` for all of your `Fetch` components.

Read [more about it here](docs/fetch-api#renderloading).

## requestTimeout

**Number:** If you want your requests to time out, just pass the amount of milliseconds in this prop.

The default is 0 (no timeout) which means the requests will _never_ timeout.

For instance, let's say we want some request to timeout if it doesn't resolve in under 3 seconds:

```
<Fetch name="todos" timeout={3000} render={...} />
```

## urlParser

**Format:** `string => string`

**Function:** If you don't use the [`path`](/docs/use-croods-api#path) or [`customPath`](/docs/use-croods-api#custompath) params, Croods builds your endpoints based on `name` and `id`.

It means that Croods will join the given `name` with the `id` (for `GET info`, `PUT` and `DELETE` requests) or just the `name` (for `GET list` and `POST` requests).

This function is usefull to transform the `name` into a valid endpoint for your API.

The default parser is [kebab-case](https://lodash.com/docs/4.17.11#kebabCase) which means that `thisName` will become `this-name`. For instance:

```
<Fetch name="userPosts" render={...} />
// GET /user-posts

<Fetch name="userPosts" id={1} render={...} />
// GET /user-posts/1
```

You can pass a custom function here to customize this behavior. Let's say our API endpoints follow the `snake_case` pattern:

```
import snakeCase from 'lodash/snakeCase'

<CroodsProvider urlParser={snakeCase}>
  <Fetch name="userPosts" render={...} />
</CroodsProvider>
// GET /user_posts
```
