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

Read more about it on [useCroods hook API](/docs/use-croods-api#name).

#### Usage:

```jsx
<Fetch
  name="todos"
  render={list => list.map(item => <div />)}
/>
// GET /todos
// state = { todos: { list: [...], fetchingList: false, ... } }
```

## path

Read more about it on [useCroods hook API](/docs/use-croods-api#path).

#### Usage:

```jsx
<Fetch
  name="todos"
  id={1}
  path="foo/bar"
  render={info => <div />}
/>
// GET /foo/bar/1
```

## customPath

Read more about it on [useCroods hook API](/docs/use-croods-api#custompath).

#### Usage:

```jsx
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

Read more about it on [useCroods hook API](/docs/use-croods-api#id).

#### Usage:

```jsx
<Fetch
  name="todos"
  id={1}
  render={info => <div />}
/>
// GET /todos/1
// state = { todos: { info: {...}, fetchingInfo: false, ... } }
```

## stateId

Read more about it on [useCroods hook API](/docs/use-croods-api#stateid).

#### Usage:

```jsx
<Fetch
  name="todos"
  stateId="user"
  render={list => list.map(item => <div />)}
/>
// GET /todos
// state = { todos@user: { list: [...], fetchingList: false, ... } }
```

## query

**Object:** This is used when you want to append a queryString to your URL.

It will convert a given object with numbers, strings and array values to a [queryString](https://en.wikipedia.org/wiki/Query_string) format.

It is equivalent to the [query parameter of `fetch`](/docs/the-actions#fetch) and `destroy`.

#### Usage:

```jsx
<Fetch
  name="todos"
  query={{ page: 2, tags: ['red', 'yellow'] }}
  render={list => list.map(item => <div />)}
/>
// GET /todos?page=2&tags[]=red&tags[]=yellow
```

**Important:** This object will filter `nil` values (`null` or `undefined`) as well as `NaN` because usually we don't want a queryString like: `/users?role=undefined&page=NaN`, right?
It does not filter falsy values though:

```jsx
<Fetch
  name="todos"
  query={{ page: 2, user: undefined, foo: null, bar: NaN, weWantThis: false, zero: 0 }}
  render={list => list.map(item => <div />)}
/>
// GET /todos?page=2&weWantThis=false&zero=0
```

## render

**Format:** `((array | object), [object, object]) => React Element`

**Required Function:** this function follows the [render props](https://reactjs.org/docs/render-props.html) standard.

It will receive 2 parameters and should return a React element that will be rendered as soon as the `GET` request succeeds.

#### Usage:

#### First parameter (info/list)

The first parameter will be an array or an object, depending on the type of your `GET` request. If you set an [`id`](#id), this parameter will be your `state.info`:

```jsx
<Fetch id={1} render={info => info.name} />
```

Otherwise it will be `state.list`:

```jsx
<Fetch render={list => list.map(item => item.name)} />
```

#### Second parameter ([The Croods Tuple](/docs/main-concepts#the-croods-tuple))

This parameter is the Croods tuple and can be [destructured](http://exploringjs.com/es6/ch_destructuring.html#_object-destructuring) into the state/actions you need in your `render`.

```jsx
<Fetch render={(list, [{ info }, { destroy }]) => list.map(item => (
  <div className={item.id === info.id ? 'active' : 'inactive'}>
    {item.name}
    {' '}
    <button onClick={destroy({ id: item.id })}>Delete item</button>
  </div>
))} />
```

## renderError

**Format:** `String => React Element`

**Function:** It will receive the error string (parsed with [`parseErrors`](/docs/croods-provider-api#parseerrors)) and should return a React element that will be rendered as soon as a `GET` request fails.

#### Usage:

```jsx
<Fetch
  renderError={error => (
    <span style={{ color: 'red' }}>
      Something went wrong - {error}
    </span>
  )}
  render={...}
/>
```

## renderEmpty

**Format:** `() => React Element`

**Function:** It will be called if your `GET` request returns no results.

If you don't set a `renderEmpty` function, you'll have to deal with empty state on your `render` methods.

#### Usage:

```jsx
<Fetch
  renderEmpty={() => 'No items were found'}
  render={...}
/>
```

## renderLoading

**Format:** `() => React Element`

**Function:** It will be called while your `GET` request is pending.

#### Usage:

```jsx
<Fetch
  renderLoading={() => <MyAwesomeSpinnerComponent />}
  render={...}
/>
```

or:

```jsx
<Fetch
  renderLoading={MyAwesomeSpinnerComponent}
  render={...}
/>
```
