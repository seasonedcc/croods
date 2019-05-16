---
id: debugging
title: Debugging
---

Croods has 2 built-in debuggers:

## debugActions

This debugger will log to the console all Croods internal actions.

Which means that anything that changes the global state will have a name, like `LIST REQUEST` (when using `fetch`) and their resolutions `LIST SUCCESS`/`LIST FAILURE`, as well as `SAVE REQUEST`, `DESTROY REQUEST` and their resolutions.

Those logs will be color-coded according to `REQUEST/SUCCES/FAILURE` and will show the changed piece of state as well as the whole Croods global state.

Ex:

```
LIST SUCCESS [images]
-> {..., list: [{ id: 1, src: 'foo.png' }, { id: 2, src: 'bar.png' }]}
-> {
    images: {
      {..., list: [{ id: 1, src: 'foo.png' }, { id: 2, src: 'bar.png' }]}
    },
    todos: {...},
    users: {...},
  }
```

#### Usage

Just add the prop to either of your `CroodsProvider`, `Fetch` component or as a parameter to `useCroods` hook or your actions:

```
<Fetch
  name="images"
  debugActions
  render={...}
/>

// Or

const Todo = ({ id }) => {
  const [state, actions] = useCroods({ name: 'todos', debugActions: true })
  return <div />;
}

// Or

const [, { save }] = useCroods({ name: 'todos' })
return <button onClick={save({ debugActions: true })} />;

// Or log all Croods activity on development
// environment for your whole App
<CroodsProvider
  debugActions={process.env.NODE_ENV === 'development'}
  baseUrl="https://dog.ceo/api/breed/beagle"
>
  <App />
</CroodsProvider>

```

## debugRequests

This debugger will log to the console all of the requests done by Croods.

It will also show the response given by the API.
This method is very usefull when you are in doubt of how to use the `parseResponse` method to populate your `info/list`, analizing the whole response object you'll now how to extract the data you want.

The **usage** is the same as for the [`debugActions`](#debugactions) and the resulting logs will look something like this:

```
REQUEST:
-> GET /colors

RESPONSE:
-> GET: /colors
-> { data: { page: 1, total: 12, data: [...], headers... } }
```

After analizing the response you know that your `parseResponse` should be:

```
<Fetch
  name="colors"
  parseResponse={response => response.data.data}
  ...
/>
```

## Example

To see both debuggers working, just go to the [Live Example](/docs/live-example) and have your JS console open.
