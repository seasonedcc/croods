---
id: cauth-forgot-password
title: useForgotPassword
---

**Format:** `options => [state, sendEmail]`

This hook returns a set of utilities for building a forgot password form. It deals with form errors, form state and the Croods requests for you. It also returns the function to send all this data to the backend.

## Returned values

```
const [{
    formProps, // it contains props for the <form> element
    emailProps, // it contains props for the email <input> element
    fields // it contains props for the other form fields
    formState, // an object that contains input values, errors, and other info
    sending, // true when executing the request
    error, // error string in the request
  },
  sendFunction // (email, redirectUrl) => sends email and redirectUrl to backend
] = useForgotPassword()
```

## Recommended configuration

Other than all the [Croods configuration](/docs/croods-provider-api) you already know, this hook receives an extra configuration parameter `redirectUrl` that will be sent with the form data to the backend:

```
const tuple = useForgotPassword({
  redirectUrl: '/reset-password',
  afterSuccess: () => navigate('/email-sent'),
})
```

## Usage samples

Assuming basic understanding of [`useSignIn`](/docs/cauth-sign-in#usage-samples).

#### Build a simple forgot password form

You do receive the `fields` value, but a common pattern is to only send the `email` and `redirectUrl` to the backend. The later is already set on the options and if not set will default to `'/'`.

```
const [{ sending, formProps, emailProps }] = useForgotPassword({
  redirectUrl: '/reset-password',
})
const text = sending ? 'Sending...' : 'Send email'
return (
  <form {...formProps}>
    <h2>Forgot your password?</h2>
    <Input {...emailProps} />
    <button type="submit" className="btn">
      {text}
    </button>
  </form>
)
```

#### Using the received function

```
const [{ sending }, sendMail] = useForgotPassword()
const text = sending ? 'Sending...' : 'Send reset instructions to John'
return (
  <button onClick={() =>
    sendMail({ email: 'john@doe.com', redirectUrl: '/reset' })
  }>
    {text}
  </button>
)
```
