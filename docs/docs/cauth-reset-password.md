---
id: cauth-reset-password
title: useResetPassword
---

**Format:** `options => [state, reset]`

This hook returns a set of utilities for building a reset password form. It deals with form errors, form state and the Croods requests for you. It also returns the function to send all this data to the backend.

## Returned values

```
const [{
    formProps, // it contains props for the <form> element
    passwordProps, // it contains props for the password <input> element
    passwordConfirmationProps, // it contains props for the password
    // confirmation <input> element
    fields // it contains props for the other form fields
    formState, // an object that contains input values, errors, and other info
    reseting, // true when executing the request
    error, // error string in the request
  },
  resetFunction // grabs the token from the URL and executes the request
] = useResetPassword()
```

## Recommended configuration

Other than all the [Croods configuration](/docs/croods-provider-api) you already know, this hook receives two extra configuration parameters: `location` which should be an object with a `search` key and `tokenKey` which is a string.

If nothing is passed, Croods-auth will get the `window.location`. `useResetPassword` will grab the token from `location.search`. The default locationKey is `reset_password_token`:

```
const myRouterLocation = { search: '?my-token=90fsd890sd8f90xc' }

const tuple = useResetPassword({
  location: myRouterLocation,
  tokenKey: 'my-token'
})
```

On the above example, the data sent to the backend along with the new password is going to be `{ my_token: '90fsd890sd8f90xc' }`, providing that you left `snakeCase` as the default [`paramsParser`](/docs/croods-provider-api#paramsparser).

## Usage samples

Assuming basic understanding of [`useSignIn`](/docs/cauth-sign-in#usage-samples).

#### Build a simple reset password form

You do receive the `fields` value, but a common pattern is to only send the `password` and `passwordConfirmation` along with the token to the backend.

```
const [{
  reseting, formProps, passwordProps, passwordConfirmationProps,
}] = useResetPassword({
  afterSuccess: () => navigate('/sign-in'),
})
const text = reseting ? 'Reseting...' : 'Reset email'
return (
  <form {...formProps}>
    <h2>Reset Password</h2>
    <Input {...passwordProps} />
    <Input {...passwordConfirmationProps} />
    <a href="/sign-in">Go to Sign In</a>
    <button type="submit" className="btn">
      {text}
    </button>
  </form>
)
```

#### Using the received function

```
const params = new URLSearchParams(window.location.search)
const token = params.get('my-token')
const [, resetPassword] = useResetPassword({
  afterSuccess: () => navigate('/sign-in'),
})
return (
  <button onClick={() =>
    resetPassword({ token, password: 'S3cr3t', passwordConfirmation: 'S3cr3t' })
  }>
    Reset
  </button>
)
```
