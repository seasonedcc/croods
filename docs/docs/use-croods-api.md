---
id: use-croods-api
title: useCroods
---

This [hook](https://reactjs.org/docs/hooks-intro.html) receives a configuration object that can/should use every prop described on [CroodsProvider](/docs/croods-provider-api) as well as the options below.

| Property                      |  Type  | Required | Default | Example |
| ----------------------------- | :----: | :------: | :-----: | :-----: |
| [name](#name)                 | String |    ✔     |    -    |         |
| [path](#path)                 | String |          |    -    |         |
| [stateId](#stateid)           | String |          |    -    |         |
| [query](#query)               | Object |          |    -    |         |
| [id](#id)                     | String |          |    -    |         |
| [fetchOnMount](#fetchonmount) |  Bool  |    ✔     |    -    |         |

## name

Read more on the [Fetch](/docs/fetch-api#name) component.

```
const tuple = useCroods({ name: 'todos', fetchOnMount: true })
// GET /todos
// state = { todos: { list: [...], fetchingList: false, ... } }
```

## path

Read more on the [Fetch](/docs/fetch-api#path) component.

```
const tuple = useCroods({
  name: 'todos',
  id: 1,
  path: '/foo/bar',
  fetchOnMount: true,
})
// GET /foo/bar
```

## id

Read more on the [Fetch](/docs/fetch-api#id) component.

```
const tuple = useCroods({
  name: 'todos',
  id: 1,
  fetchOnMount: true,
})
// GET /todos/1
// state = { todos: { info: {...}, fetchingInfo: false, ... } }
```

## stateId

Read more on the [Fetch](/docs/fetch-api#stateid) component.

```
const tuple = useCroods({
  name: 'todos',
  stateId: 'user',
  fetchOnMount: true,
})
// GET /todos
// state = { todos@user: { list: [...], fetchingList: false, ... } }
```

## query

Read more on the [Fetch](/docs/fetch-api#query) component.

```
const tuple = useCroods({
  name: 'todos',
  query: { page: 2, tags: ['red', 'yellow'] },
  fetchOnMount: true,
})
// GET /todos?page=2&tags[]=red&tags[]=yellow
```

## fetchOnMount

**Boolean:** set this param to `true` if you want the `useCroods` hook to **fetch** (send a `GET` request) as soon as when the component mounts.

We recommend using [the Fetch](/docs/fetch-api) component when you want to fetch something and `useCroods` hook when you want to perform the [other actions](/docs/the-actions).

But you may have a good reason to use it this way. One of the main reasons we aknowledge is avoiding the [nesting hell](https://medium.com/@ntgard/why-i-dont-use-render-props-in-react-10f18abdff11) that the [render props](https://reactjs.org/docs/render-props.html) approach give you.

For instance, this code:

```
const Form = ({ id }) => {
  const [{ info: todos }] = useCroods({ name: 'todos', fetchOnMount: true })
  const [{ info: colors }] = useCroods({ name: 'todos', fetchOnMount: true })
  const [, { save }] = useCroods({ name: 'submissions' })
  return (
    <form onSubmit={save()}>
      <label>Select a task</label>
      <select>{todos.map(todo => <option>{todo.title}</option>)}</select>
      <label>Select a color</label>
      <select>{todos.map(todo => <option>{todo.title}</option>)}</select>
      <button>Submit</button>
    </form>
  )
}
```

reads much better then this one:

```
const Form = ({ id }) => {
  const [, { save }] = useCroods({ name: 'submissions' })
  return (
    <Fetch
      name="todos"
      render={todos => (
        <Fetch
          name="colors"
          render={colors => (
            <form onSubmit={save()}>
              <label>Select a task</label>
              <select>{todos.map(todo => (
                  <option>{todo.title}</option>
              ))}</select>
              <label>Select a color</label>
              <select>{todos.map(todo => (
                <option>{todo.title}</option>
              ))}</select>
              <button>Submit</button>
            </form>
          )}
        />
      )}
    />
  )
}
```

#### Don't forget the loading / errors / empty states

There's a good reason to have the `Fetch` component though, [read more about it here](/docs/the-fetch).
