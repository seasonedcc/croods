---
id: fetch-api
title: Fetch
---

This component accepts the props described below and can override all of the props described on [CroodsProvider](/docs/croods-provider-api).

| Property                        |     Type      | Required |                        Default                        |
| ------------------------------- | :-----------: | :------: | :---------------------------------------------------: |
| [name](#name)                   |    String     |    ✔     |                           -                           |
| [stateId](#stateid)             | String/number |          |                           -                           |
| [path](#path)                   |    String     |          |                           -                           |
| [customPath](#custompath)       |    String     |          |                           -                           |
| [id](#id)                       |    String     |          |                           -                           |
| [query](#query)                 |    Object     |          |                           -                           |
| [render](#render)               |     Func      |    ✔     |                           -                           |
| [renderError](#rendererror)     |     Func      |          | error => <div style={{ color: 'red' }}>{error}\</div> |
| [renderEmpty](#renderempty)     |     Func      |          |                      () => null                       |
| [renderLoading](#renderloading) |     Func      |          |             () => \<div>Loading...\</div>             |

## name

Read more on about it on [useCroods hook API](/docs/use-croods-api#name).

#### Usage:

```
<Fetch
  name="todos"
  render={list => list.map(item => <div />)}
/>
// GET /todos
// state = { todos: { list: [...], fetchingList: false, ... } }
```

## path

Read more on about it on [useCroods hook API](/docs/use-croods-api#path).

#### Usage:

```
<Fetch
  name="todos"
  id={1}
  path="foo/bar"
  render={info => <div />}
/>
// GET /foo/bar
```

## customPath

Read more on about it on [useCroods hook API](/docs/use-croods-api#custompath).

#### Usage:

```
<Fetch
  name="todos"
  id={1}
  customPath="foo/:id/bar"
  render={info => <div />}
/>
// GET /foo/1/bar
```

## id

When used in a `Fetch` component, this option will tell Croods that you are doing a `GET info` request, thus targeting the `state.info`, `state.fetchingInfo` and `state.infoError` pieces of state.

Otherwise the `Fetch` component will do a `GET list`, targeting `state.list`, `state.fetchingList` and `state.listError`.

Read more on about it on [useCroods hook API](/docs/use-croods-api#id).

#### Usage:

```
<Fetch
  name="todos"
  id={1}
  render={info => <div />}
/>
// GET /todos/1
// state = { todos: { info: {...}, fetchingInfo: false, ... } }
```

## stateId

Read more on about it on [useCroods hook API](/docs/use-croods-api#stateid).

#### Usage:

```
<Fetch
  name="todos"
  stateId="user"
  render={list => list.map(item => <div />)}
/>
// GET /todos
// state = { todos@user: { list: [...], fetchingList: false, ... } }
```

## query

**Object:** This is used on `GET` requests, when you want to send query parameters (parameters on your URL) when fetching.

It will convert a given object with numbers, strings and array values to a [queryString](https://en.wikipedia.org/wiki/Query_string) format.

It is equivalent to the [query parameter of `fetch`](/docs/the-actions#fetch) and `destroy`.

#### Usage:

```
<Fetch
  name="todos"
  query={{ page: 2, tags: ['red', 'yellow'] }}
  render={list => list.map(item => <div />)}
/>
// GET /todos?page=2&tags[]=red&tags[]=yellow
```

## render

**Format:** `((array | object), [object, object]) => React Element`

**Required Function:** this function follows the [render props](https://reactjs.org/docs/render-props.html) standard.

It will receive 2 parameters and should return a React element that will be rendered as soon as the `GET` request succeeds.

#### Usage:

#### First parameter (info/list)

The first parameter will be an array or an object, depending on the type of your `GET` request. If you set an [`id`](#id), this parameter will be your `state.info`:

```
<Fetch id={1} render={info => info.name} />
```

Otherwise it will be `state.list`:

```
<Fetch render={list => list.map(item => item.name)} />
```

#### Second parameter ([The Croods Tuple](/docs/main-concepts#the-croods-tuple))

This parameter is the Croods tuple and can be [destructured](http://exploringjs.com/es6/ch_destructuring.html#_object-destructuring) into the state/actions you need in your `render`.

```
<Fetch render={(list, [{ info }, { destroy }]) => list.map(item => (
  <div className={item.id === info.id ? 'active' : 'inactive'}>
    {item.name}
    {' '}
    <button onClick={destroy({ id: item.id })}>Delete item</button>
  </div>
))} />
```

## renderError

**Format:** `Error => React Element`

**Function:** It will receive the error parameter and should return a React element that will be rendered as soon as a `GET` request fails.

#### Usage:

```
<Fetch
  renderError={error => (
    <span style={{ color: 'red' }}>
      Something went wrong - {error.message}
    </span>
  )}
  render={...}
/>
```

## renderEmpty

**Format:** `() => React Element`

**Function:** It will be called if your `GET` request returned no results.

If you don't set a `renderEmpty` function, you'll have to deal with empty state on your `render` methods.

#### Usage:

```
<Fetch
  renderEmpty={() => 'No items were found'}
  render={...}
/>
```

## renderLoading

**Format:** `() => React Element`

**Function:** It will be called while your `GET` request is pending.

#### Usage:

```
<Fetch
  renderLoading={() => <MyAwesomeSpinnerComponent />}
  render={...}
/>
```

or:

```
<Fetch
  renderLoading={MyAwesomeSpinnerComponent}
  render={...}
/>
```
