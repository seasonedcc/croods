---
id: cauth-sign-in
title: useSignIn
---

**Format:** `options => [state, signIn]`

This hook returns a set of utilities for building a sign in form. It deals with form errors, form state and the Croods requests for you. It also returns the function to send all this data to the backend.

## Returned values

```jsx
const [{
    formProps, // it contains props for the <form> element
    passwordProps, // it contains props for the password <input> element
    emailProps, // it contains props for the email <input> element
    fields // it contains props for the other form fields
    formState, // an object that contains input values, errors, and other info
    signingIn, // true when executing the request
    error, // error string in the request
  },
  signIn, // executes the sign in request
] = useSignIn()
```

## Recommended configuration

It is **important** that you provide an [`afterSuccess`](/docs/croods-provider-api#aftersuccess) with a plan to when the signIn succeeds. For instance:

```jsx
const tuple = useSignIn({
  afterSuccess: () => navigate('/dashboard'),
})
```

Other than all the [Croods configuration](/docs/croods-provider-api) you already know, you can also set your [`storage`](/docs/cauth-headers#storage) method and [`storageKey`](/docs/cauth-headers#storagekey), because Croods-auth will use those values to save the headers on your `localStorage`.

```jsx
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

```jsx
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

```jsx
const [{ formProps, emailProps, passwordProps, fields, fieldError }] = useSignIn()

return (
  <form {...formProps}>
    <h2>Sign In</h2>
    <Input {...fields.text('fullName')} error={fieldError('fullName')} />
    <Input {...emailProps} />
    <Input {...passwordProps} />
    <input {...fields.checkbox('terms')} />
    <button type="submit" className="btn">
      Sign in
    </button>
  </form>
)
```

#### A convenience method

We also provide `fieldProps` to create another fields with validation and have the error feedback built in.

It has the following format: `fieldProps(type, name, validations)`. Where `type` is the `input` type, like `'email'/'text'/'number'`. `name` will be the name of the input to be accessible in the `formState`. The third parameter `validations` is an array of functions that follows the [`redux-form-validators`](https://github.com/gtournie/redux-form-validators#confirmation) format, which is: `(value, allFormValues) => string | undefined`.

```jsx
import words from 'lodash/words'

const minWords = length => value => words(value).length < length
  ? `Field must have at least ${length} words`
  : undefined

const presence = value => value ? undefined : 'Field must have a value'
const [{ formProps, emailProps, passwordProps, fieldProps }] = useSignIn()

return (
  <form {...formProps}>
    <h2>Sign In</h2>
    <Input {...fieldProps('text', 'fullName', [presence, minWords(2)])} />
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

The fields will already receive the `error` string prop through `emailProps`, `fieldProps`, etc. But you can also show the errors comming from the API with the `error` value like so:

```jsx
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

You can use `formState` and `isFormValid` to have access to the form state like so:

```jsx
const [{
  formState, formProps, isFormValid, emailProps, passwordProps,
}] = useSignIn()

return (
  <form {...formProps} className={isFormValid ? 'valid' : 'invalid'}>
    <h2>Sign In as: {formState.values.email}</h2>
    <Input {...emailProps} />
    <Input {...passwordProps} />
    <button type="submit" className="btn">Sign in</button>
  </form>
)
```

#### Using the received function

```jsx
const [, signIn] = useSignIn()

return (
  <button onClick={() =>
    signIn({ email: 'john@doe.com', password: 'S3cr3t' })
  }>
    Sign in as John
  </button>
)
```
