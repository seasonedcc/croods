---
id: cauth-sign-up
title: useSignUp
---

**Format:** `options => [state, signUp]`

This hook returns a set of utilities for building a sign up form. It deals with form errors, form state and the Croods requests for you. It also returns the function to send all this data to the backend.

## Returned values

```
const [{
    formProps, // it contains props for the <form> element
    passwordProps, // it contains props for the password <input> element
    passwordConfirmationProps, // it contains props for the password
    // confirmation <input> element
    emailProps, // it contains props for the email <input> element
    fields // it contains props for the other form fields
    formState, // an object that contains input values, errors, and other info
    signingUp, // true when executing the request
    error, // error string in the request
  },
  signUp, // executes the sign up request
] = useSignUp()
```

## Recommended configuration

Same as [`useSignIn`](/docs/cauth-sign-in#recommended-configuration).

## Usage samples

Assuming basic understanding of [`useSignIn`](/docs/cauth-sign-in#usage-samples), everything is pretty much the same here.

#### Build a simple sign up form

Now we get the `passwordConfirmationProps` which is a very common pattern in sign up forms.

```
const [{
  error, signingUp, formProps, emailProps,
  passwordProps, passwordConfirmationProps, fields,
}] = useSignIn({
  afterSuccess: () => navigate(`/`),
})
const text = signingUp ? 'Signing up...' : 'Sign up'
return (
  <form {...formProps}>
    <h2>Sign Up</h2>
    <Input {...fields.text('firstName')} />
    <Input {...fields.text('lastName')} />
    <Input {...emailProps} />
    <Input {...passwordProps} />
    <Input {...passwordConfirmationProps} />
    <Checkbox {...fields.checkbox('terms')} />
    {error && <span style={{ color: 'red' }}>{error}</span>}
    <button type="submit" className="btn">
      {text}
    </button>
  </form>
)
```
