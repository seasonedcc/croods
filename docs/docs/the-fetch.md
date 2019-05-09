---
id: the-fetch
title: The Fetch component
---

Usually when you want to have your `state.list` or `state.info` pre-populated, you'll have to deal with:

- **Loading state** - when you made the request but has not get a response yet
- **Empty state** - when there's no items in the backend response and your list is empty
- **Error state** - whenever your API breaks

This very common pattern will soon leave your code looking something like this:

```
import { useCroods } from 'croods'

const Todos = () => {
  const [{ fetchingList, listError, list }] = useCroods({
    name: 'todos',
    fetchOnMount: true,
  })

  if (fetchingList) {
    return 'Loading...'
  }

  if (listError) {
    return <span style={{ color: 'red' }}>{listError}</span>
  }

  if (list.length === 0) {
    return 'No todos found'
  }

  return (
    <ul>
      list.map(todo => <li>{todo.text}</li>)
    </ul>
  )
}
```

## Using Fetch

You can achieve the same result (but with cleaner code) using the `Fetch` component:

```
import { Fetch } from 'croods'

const Todos = () => (
  <Fetch
    name="todos"
    render={list => (
      <ul>
        list.map(todo => <li>{todo.text}</li>)
      </ul>
    )}
    renderError={error => <span style={{ color: 'red' }}>{error}</span>}
    renderEmpty={() => 'No todos found'}
    renderLoading={() => 'Loading...'}
  />
)
```

It can receive throught `props` anything you'd pass to `useCroods`.
Your `render` prop receives two parameters:
- The first will be your fetched data. It can be either a `list` of resources, if you didn't pass an `id` prop, or `info` on a specific resource.
- The second parameters will be [the Croods tuple](/docs/main-concepts#the-croods-tuple).

Check out an example of a request to a single item with option to edit it:

```
const Todo = ({ id }) => (
  <Fetch
    id={id}
    name="users"
    render={(info, [{ saving }, { save }]) => (
      <div
          className="todo"
          style={{ color: info.completed ? "green" : "black" }}
        >
          <h1>{info.title}{saving ? ' - Saving...' : ''}</h1>
          <button onClick={() => {
            save(id)({ ...info, completed: !info.completed })
          }}>
            Toggle completed
          </button>
        </div>
    )}
  />
)
```

**The result:**

<iframe src="https://codesandbox.io/embed/k3o03ln95o?fontsize=14" title="k3o03ln95o" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

## Setting up defaults

You can benefit even more from this component if you set your project defaults on [CroodsProvider](/docs/croods-provider-api):

```
import { CroodsProvider, Fetch } from 'croods'
import MyErrorComponent from './MyErrorComponent'
import MyLoadingComponent from './MyLoadingComponent'
import Post from './Post'

const Home = () => (
  <div>
    <h1>My Blog</h1>
    <Fetch
      name="posts"
      render={list => list.map(post => <Post key={post.id} {...post} />)}
    />
  </div>
)

const App = () => (
  <CroodsProvider
    renderError={MyErrorComponent}
    renderLoading={MyLoadingComponent}
    renderEmpty={() => 'Nothing here'}
    baseUrl="https://jsonplaceholder.typicode.com/"
  >
    <Home>
  </CroodsProvider>
)
```
