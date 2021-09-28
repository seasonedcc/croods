---
id: use-croods-api
title: useCroods
---

This [hook](https://reactjs.org/docs/hooks-intro.html) receives a configuration object that can override every prop described on [CroodsProvider](/docs/croods-provider-api) as well as the options below.

| Property                      |  Type  | Required | Default |
| ----------------------------- | :----: | :------: | :-----: |
| [name](#name)                 | String |    ✔     |    -    |
| [path](#path)                 | String |          |    -    |
| [customPath](#custompath)                 | String |          |    -    |
| [stateId](#stateid)           | String |          |    -    |
| [query](#query)               | Object |          |    -    |
| [id](#id)                     | String |          |    -    |
| [fetchOnMount](#fetchonmount) |  Bool  |    ✔     |  false  |

## name

**String:** This options is **required** everytime you use Croods, be it on a `useCroods` hook or `Fetch` component.

If you don't use the `path` param, Croods will build your endpoint request based on the `name`/ [`id`](#id) options.

This options also controls the key name of your state in the [Global State](/docs/the-state) object.

#### Usage:

For instance, if you use `name: 'todos'` it will change your request **and** your global state as follows:

```
const MyComponent = () => {
  const tuple = useCroods({ name: 'todos', fetchOnMount: true })
  // GET /todos
  // state = { todos: { list: [...], fetchingList: false, ... } }
}
```

Then, if you use the same `name` in other component, you'll have access to the same `state` under `todos` key.

```
const OtherComponent = () => {
  const [{ list }, { save }] = useCroods({ name: 'todos' })
  // list will already be populated, without having to fetch again
  console.log(list) // [{ text: 'Foo', completed: true }]
}

```

If your other component also fetches the same endpoint, it'll avoid the extra request if you set [`cache`](/docs/croods-provider-api#cache) to `true`.

## path

**String:** Use this option when you want to set an endpoint that is different than the `name`.

Croods will still append your given `id` at the end of your path


#### Usage:

```
// with id
const tuple = useCroods({
  name: 'todos',
  id: 1,
  path:"/foo/bar",
  fetchOnMount: true
})

// GET /foo/bar/1

// without id
const tuple = useCroods({
  name: 'todos',
  path:"/foo/bar",
  fetchOnMount: true
})

// GET /foo/bar
```

## customPath

**String:** Use this option when you want to prevent Croods from managing your endpoint.


It will override the request endpoint with the one you provide. This also affects the behavior of the [`id`](#id) option. It takes precedence over `path` (which means, `path` will not be used).

#### Usage:

```
const [, { save }] = useCroods({
  name: 'todos',
  id: 1,  // this is not going to be used
  path: "bar/foo",  // this is not going to be used
})
save({ customPath: '/foo/bar/' })()

// POST /foo/bar
```

You can explicitly tell Croods where to insert your id:
```
const [, { save }] = useCroods({
  name: 'todos',
  id: 1, // this is going to be used
  path: "bar/foo",  // this is not going to be used
})
save({ customPath: '/foo/:id/bar/' })()

// POST /foo/1/bar
```

## query

**Object:** This is used on `GET` requests, when you want to send query parameters (parameters on your URL) when fetching is called by Croods (read [`fetchOnMount`](#fetchonmount)).

It will convert a given object with numbers, strings and array values to a [queryString](https://en.wikipedia.org/wiki/Query_string) format.

#### Usage:

```
const tuple = useCroods({
  name: 'todos',
  query: { page: 2, tags: ['red', 'yellow'] },
  fetchOnMount: true,
})
// GET /todos?page=2&tags[]=red&tags[]=yellow
```

## id

**String|Number:** For requests aiming a single item, like `GET info`, `PUT` or `DELETE`. You can pass this option so croods will _guess_ the endpoint.

It will do it by joining [`name`](#name) with the given `id` as follows:

#### Usage:

```
const tuple = useCroods({
  name: 'todos',
  id: 1,
  fetchOnMount: true,
})
// GET /todos/1
// state = { todos: { info: {...}, fetchingInfo: true, ... } }
```

**Important:** If you use [`customPath`](#custompath) this `id` will not be appended to the endpoint.

## stateId

**String:** This prop is optional and will store your data state in a separate piece of the [Global state](/docs/the-state).

It is usefull for when you want to make requests in an already used endpoint but you don't want to mess with the data you already have stored.

For instance, you want to grab the list of todos from a single user but you want to keep the list of all todos in your homepage untouched, or you want to grab a list of todos under a certain tag:

```
const [{ list }, { fetch }] = useCroods({ name: 'todos', stateId: 'completed' })
fetch()({ tags: ['completed'] })
```

The code above will not interfere on your todos, because your global state will look like this:

```
{
  'todos': { list: [/* 10 items */], ... },
  'todos@completed': { list: [/* 3 items */], ... },
}
```

Thus if you are [caching](/docs/croods-provider-api#cache) and go back to the homepage you will still have your untouched list with 10 items without having to fetch again.

#### Usage:

```
const tuple = useCroods({
  name: 'todos',
  stateId: 'user',
  fetchOnMount: true,
})
// GET /todos
// state = { todos@user: { list: [...], fetchingList: false, ... } }
```

## fetchOnMount

**Boolean:** set it to `true` if you want the `useCroods` hook to **fetch** (send a `GET` request) as soon as the component mounts.

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
const Form = () => {
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

or 😅:

```
const Todos = () => (
  <Fetch
    name="todos"
    render={todos => <Colors todos={todos} />}
  />
)

const Colors = ({ todos }) => (
  <Fetch
    name="colors"
    render={colors => <Form todos={todos} colors={colors} />}
  />
)

const Form = ({ todos, colors }) => {
  const [, { save }] = useCroods({ name: 'submissions' })
  return (
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
  )
}
```

#### Don't forget the loading / errors / empty states

There's a good reason to have the `Fetch` component though, [read more about it here](/docs/the-fetch).
