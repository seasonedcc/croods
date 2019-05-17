---
id: cauth-sign-in
title: useSignIn
---

**Format:** `options => [state, signIn]`

This hook returns a set of utilities for building a sign in form. It deals with form errors, form state and the Croods requests for you. It also returns the function to send all this data to the backend.

## Returned values

```
const [{
    formProps, // it contains props for the <form> element
    passwordProps, // it contains props for the password <input> element
    emailProps, // it contains props for the email <input> element
    fields // it contains props for the other form fields
    formState, // an object that contains input values, errors, and other info
    signingIn, // true when executing the request
    signed, // the API response after request is successfull
    error, // error string in the request
  },
  signIn, // executes the sign in request
] = useSignIn()
```

## Recommended configuration

It is **important** that you provide an [`afterSuccess`](/docs/croods-provider-api#aftersuccess) with a plan to when the signIn succeeds. For instance:

```
const tuple = useSignIn({
  afterSuccess: () => navigate('/dashboard'),
})
```

Other than all the [Croods configuration](/docs/croods-provider-api) you already know, you can also set your [`storage`](/docs/cauth-headers#storage) method and [`storageKey`](/docs/cauth-headers#storagekey), because Croods-auth will use those values to save the headers on your `localStorage`.

```
import { AsyncStorage } from 'react-native'

const tuple = useSignIn({
  afterSuccess: () => navigate('/'),
  storage: AsyncStorage,
  storageKey: 'mySp3ci4lK3y',
})
```

If you leave it as is, Croods-auth will use the [defaults](/docs/cauth-headers).

## Usage samples

We are assuming a [trivial input component](https://github.com/SeasonedSoftware/croods-auth/blob/master/example/src/Input.js) on all examples below.

#### Build a simple sign in form

The `formProps` already has everything you need for when you submit the form. That means a basic `button` inside the form will be enough to dispatch the Croods request.

And the `emailProps` and `passwordProps` will take care of storing the form state and sending it when the form submits.

```
const [{
  signingIn, formProps, emailProps, passwordProps,
}] = useSignIn({
  afterSuccess: () => navigate(`/`),
})
const text = signingIn ? 'Signing in...' : 'Sign in'
return (
  <form {...formProps}>
    <h2>Sign In</h2>
    <Input {...emailProps} />
    <Input {...passwordProps} />
    <button type="submit" className="btn">
      {text}
    </button>
  </form>
)
```

#### Adding extra fields on the sign in form

As we are using [`react-use-form-state`](https://github.com/wsmd/react-use-form-state) internally, you can add more fields usign its API.

```
const [{ formProps, emailProps, passwordProps, fields }] = useSignIn()
return (
  <form {...formProps}>
    <h2>Sign In</h2>
    <Input {...fields.text('name')} />
    <Input {...emailProps} />
    <Input {...passwordProps} />
    <input {...fields.checkbox('terms')} />
    <button type="submit" className="btn">
      Sign in
    </button>
  </form>
)
```

#### Showing errors

```
const [{ error, formProps, emailProps, passwordProps }] = useSignIn()
return (
  <form {...formProps}>
    <h2>Sign In</h2>
    <Input {...emailProps} />
    <Input {...passwordProps} />
    {error && <span style={{ color: 'red' }}>{error}</span>}
    <button type="submit" className="btn">
      Sign in
    </button>
  </form>
)
```

#### Working with the formState

```
const [{ formState, formProps, emailProps, passwordProps }] = useSignIn()
return (
  <form {...formProps}>
    <h2>Sign In as: {formState.values.email}</h2>
    <Input {...emailProps} />
    <Input {...passwordProps} />
    <button type="submit" className="btn">Sign in</button>
  </form>
)
```

#### Using the received function

```
const [, signIn] = useSignIn()
return (
  <button onClick={() =>
    signIn({ email: 'john@doe.com', password: 'S3cr3t' })
  }>
    Sign in as John
  </button>
)
```
