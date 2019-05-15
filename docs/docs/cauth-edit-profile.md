---
id: cauth-edit-profile
title: useEditProfile
---

**Format:** `(options, currentUserOptions) => [state, save]`

This hook returns a set of utilities for building an edit profile form. It deals with form errors, form state and the Croods requests for you. It also returns the function to send all this data to the backend.

## Returned values

```
const [{
    formProps, // it contains props for the <form> element
    fields // it contains props for the other form fields
    formState, // an object that contains input values, errors, and other info
    saving, // true when executing the request
    currentUser, // it contains the current user, up to date after the saving
    error, // error string in the request
  },
  save, // executes the save request
] = useEditProfile()
```

## Recommended configuration

This hook uses [`useCurrentUser`](/docs/cauth-current-user) hook internally, so other than all the [Croods configuration](/docs/croods-provider-api), you can pass a second parameter to set the configuration for the `useCurrentUser` hook.

```
const tuple = useEditProfile({
  afterFailure: () => {
    console.log('Form could not be saved!')
  },
}, {
  afterFailure: () => {
    console.log('Could not get currentUser')
    navigate('/sign-in')
  },
})
```

## Usage samples

Assuming basic understanding of [`useSignIn`](/docs/cauth-sign-in#usage-samples), everything is pretty much the same here.

#### Build a simple edit profile form

Use the `fields` prop for sending data from the form to the API.

```
const [{ currentUser, formProps, fields, saving }] = useEditProfile()
return (
  <form {...formProps}>
    <h2>Edit {currentUser.email}</h2>
    <Input {...fields.text('name')} />
    <Input {...fields.email('email')} />
    <button type="submit" className="btn btn-primary">
      {saving ? 'Saving...' : 'Save'}
    </button>
  </form>
)
```

#### Using the received function

Sometimes you just want to change a single value from the `currentUser`. You can do that on the client side through `currentUser`'s [`setCurrentUser`](docs/cauth-current-user#change-some-property-from-the-currentuser) method, but you can use `useEditProfile` for making that change on both back and front ends:

```
const [{ currentUser }, save] = useEditProfile()
return (
  <button onClick={() =>
    save({ admin: !currentUser.admin })
  }>
    Toggle admin
  </button>
)
```
