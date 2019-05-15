---
id: cauth-form-hooks
title: Auth Hooks
---

Here are all the hooks available to perform auth-related actions.


## useSignIn
**Format:**
```
  (options, callback) => [
    {
      fields,
      emailProps,
      passwordProps,
      formProps: { onSubmit },
      formState,
      signingIn,
      signed,
      error,
    },
    onSubmit,
  ]
  ```


## useSignUp
**Format:**
```
 (options, callback) => [
    {
      fields,
      emailProps,
      passwordProps,
      passwordConfirmationProps,
      formProps: { onSubmit },
      formState,
      signingUp,
      signedUp,
      error,
    },
    save(),
  ]
```


## useSignOut
**Format:** `(options, callback) => [
    { currentUser, signingOut, signedOut, error },
    signOut
    ]`


## useDeleteAccount
**Format:** `(options) => [
    { currentUser, deleting, deleted, error },
    deleteAccount,
  ]`


## useEditProfile
```
(options, callback) => [
    {
      fields,
      formProps: { onSubmit },
      formState,
      saving,
      error,
      currentUser,
    },
    edit,
  ]
  ```

## useForgotPassword
```
(options) => [
    {
      sending,
      error,
      formState,
      formProps: { onSubmit },
      emailProps: email('email'),
    },
    sendEmail(url),
  ]
  ```

## useResetPassword
```
(options) => [
    {
      reseting,
      error,
      formState,
      passwordProps,
      passwordConfirmationProps,
      formProps: { onSubmit },
    },
    onSubmit,
  ]
```
