---
id: the-state
title: Croods Global State
---

Croods has it's own global state management.

It stores everything in one big object in memory, pretty much like [Redux](https://redux.js.org/) and most of the modern state managers.

Everytime you use `useState` or `<Fetch />` it will use the given `name` (and possibly the `stateId`) as the object's key to store the state.

For instance:

```
const Images = () => {
  const [imagesState, imagesActions] = useCroods({
    name: 'images',
    stateId: 'fromUser',
    fetchOnMount: true,
  })
  return <div />
}

const Todos = () => {
  const [todosState, todosActions] = useCroods({ name: 'todos' })
  return <div />
}

export default = () => (
  <div>
    <Images />
    <Todos />
  </div>
)
```

Here, your `imagesState` will look like:

```
{
  destroyed: null,
  destroyError: null,
  destroying: false,
  fetchingInfo: false,
  fetchingList: true, // due to fetchOnMount
  info: null,
  infoError: null,
  list: [],
  listError: null,
  saved: null,
  saveError: null,
  saving: null,
}
```

But your whole global state will look like:

```
{
  "images@fromUser": { ..., fetchingList: true, ... }
  "todos": {..., fetchingList: false, ... },
}
```

## What is it for?

The State is read-only, which means you'll use it's values to describe your application according to the state. You can present the error messages, loading state or the data itself using your own components.

```
export default () => {
  const [state] = useCroods({ name: 'images', fetchOnMount: true })

  if (state.fetchingList) {
    return 'Component is loading...'
  }

  if (state.listError) {
    return (
      <span style={{ color: 'red' }}>
        An error ocurred: {state.listError}
      </span>
    )
  }

  return (
    <ul>
      {state.list.map(image => (
          <li key={image.id}>
            <img src={image.src} alt="My img" />
          </li>
      ))}
    </ul>
  )
}
```

## How to change Croods State

The only way to change the pieces of state you see above is through the usage of [Croods Actions](/docs/the-actions).
