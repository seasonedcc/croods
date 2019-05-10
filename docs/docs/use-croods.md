---
id: use-croods
title: The useCroods hook
---

This is the core of our tool!

The [`useCroods hook`](/docs/use-croods-api) is used - under the hood - by any other component or tool that descend from The Croods Lib.

## Usage

**It receives one parameter:** an object with options related to the requests you want to do and how you want to store the state on your global object. We will see [those parameters](/docs/croods-provider-api) later.

When you call this hook, you'll have access to [the Croods tuple](/docs/main-concepts#the-croods-tuple).
Then you can make pretty much any sort of request.

**For instance:** let's say we want to add 10 to the amount of tickets in our app. We want to reach the `/tickets` endpoint with a `PUT` request. This is how we could takle this task:

```
const AddTicketsButton = ({ ticket }) => {
  const [state, { save }] = useCroods({ name: 'tickets' })
  return (
    <button onClick={() => save({ id: ticket.id })({ amount: ticket.amount + 10 })}>
      Add 10 tickets
    </button>
  )
}
```

## Getting the result of the requests

Let's say the server will recalculate the amount of tickets and send a credit amount back to us. We want to grab the new credit and update our `currentUser` with it:

```
const AddTicketsButton = ({ ticket, setCredit }) => {
  const [state, { save }] = useCroods({ name: 'tickets' })
  const onClick = async id => {
    const data = await save({ id })({ amount: ticket.amount + 10 })
    if (data) { // it will be false if the request fails
      setCredit({ credit: data.credit })
    }
  }
  return (
    <button onClick={onClick}>Add 10 tickets</button>
  )
}
```

There's other way we could achieve the same result, using the ["after methods"](/docs/croods-provider-api#aftersuccess):

```
const AddTicketsButton = ({ ticket, setCredit }) => {
  const [state, { save }] = useCroods({
    name: 'tickets',
    afterSuccess: ({ credit }) => setCredit({ credit })
  })
  return (
    <button onClick={() => save({ id })({ amount: ticket.amount + 10 })}>
      Add 10 tickets
    </button>
  )
}
```

## Accessing multiple endpoints

You can access multiple endpoints or even different API's with multiple usages of `useCroods` in the same component.

Let's say that on the previous example, the `setCredit` method is another endpoint we must `POST` a request to:

```
const AddTicketsButton = ({ ticket }) => {
  const [creditState, creditActions] = useCroods({ name: 'credits' })
  const [ticketState, ticketActions] = useCroods({
    name: 'tickets',
    afterSuccess: ({ credit }) => creditActions.save()({ credit })
  })
  return (
    <button onClick={() => {
      ticketActions.save({ id })({ amount: ticket.amount + 10 })
    }}>
      Add 10 tickets
    </button>
  )
}
```

## fetchOnMount

Let's say you want to grab a list of todos and display them:

```
import { useEffect } from 'react'

const Todos = ({ id }) => {
  const [{ fetchingList, list }, { fetch }] = useCroods({ name: 'todos' })
  useEffect(() => {
    fetch()()
  }, [])

  return (
    <ul>
      {list.map(todo => <li>{todo.title}</li>)}
    </ul>
  )
}
```

For convenience, whenever you want to pre-populate the `state.info` or `state.list` with data from your server, you can pass `fetchOnMount: true` to your options. Then, as soon as the component mounts it'll start requesting the resource.

```
const Todos = ({ id }) => {
  const [{ fetchingList, list }, { fetch }] = useCroods({
    name: 'todos',
    fetchOnMount: true,
  })
  return (
    <ul>
      {list.map(todo => <li>{todo.title}</li>)}
    </ul>
  )
}
```

## TODO sample

Let's unite some concepts we've already learnt:

```
const Todos = ({ id }) => {
  const [{ fetchingList: loading, list: todos }, { destroy }] = useCroods({
    name: 'todos',
    fetchOnMount: true,
  })
  return loading ? (
    'Loading...'
  ) : todos.map(todo => (
    <li>
      {todo.title}
      {' '}
      <button onClick={destroy({ id: todo.id })}>
        Delete Todo
      </button>
    </li>
  ))
}
```

#### Working sample

Open your browser's JS Console and checkout this sample running on CodeSandbox:

<iframe src="https://codesandbox.io/embed/rw7wvjjj24?fontsize=14" title="rw7wvjjj24" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

#### Something easier

Just keep in mind though, that you can always use [the Fetch component](/docs/the-fetch) for your own convenience.
