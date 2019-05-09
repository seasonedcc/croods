---
id: the-actions
title: Croods Actions
---

In order access the Croods actions and be able to fetch/save/destroy data as well as changing Croods state, you need to grab the `actions` object from a [Croods Tuple](/docs/main-concepts#the-croods-tuple):

```
const [state, actions] = useCroods({ name: 'images' })

/*
  You can also get it from the Fetch component:
    <Fetch
      name="foo"
      render={(list, [ state, actions]) => ... }
    />
*/
```

Now you can use all of the following actions:

```
const { fetch, save, destroy, setInfo, setList } = actions
```

## fetch

**Format:** `id? => Promise(object | false)`

The fetch action will controll the `GET` requests and everything related to `state.list` or `state.info`.

#### Params

This method is called with one parameter `id`.

#### Info

When you pass an `id`, it will send a request to `GET /colors/:id` (unless you set the `path` param) expecting to receive a **single item** back from the API.

It will store this item on `info` unless it is still requesting (`fetchingInfo`) or the response was an error (`infoError`).

Calling it this way is equivalent to what the APIs call `INFO/SHOW/GET`.

```
const { fetchingInfo, info, infoError } = state
```

#### List

If you **don't** pass an `id`, it will send a request to `GET /colors` (unless you set the `path` param) expecting to receive an **array of items** back from the API.

It will store this item on `list` unless it is still requesting (`fetchingList`) or the response was an error (`listError`).

Calling it this way is equivalent to what the APIs call `INDEX/LIST/FIND`.

```
const { fetchingList, list, listError } = state
```

#### Result

The `return` of `fetch` will depend on if the request succeeds. If it does, you'll get the item/list when the Promise resolves and also the component will be rerendered with the new state. Otherwise the Promise will resolve to `false` and the component will be rerendered with the error message from the API:

```
const { fetchingList, list, listError } = state
const label = fetchingList ? 'Getting List...' : 'Get List!';

return (
  <div>
    <button onClick={async () => {
      const data = await actions.fetch()
      data ? alert(data) : alert('Failed!')
    }}>
      {label}
    </button>
    {listError && <span>{listError}</span>}
  </div>
)
```

## save

**Format:** `id? => object => Promise(object | false)`

The save action will controll the `POST` and `PUT` requests and everything related to `state.save`.

#### Params

This method is configured by calling it with `id` and then called again to pass the data to the server.

```
const [, { save }] = useCroods({ name: 'todos' })
const onTodoClick = todo => {
  const update = actions.save(todo.id)
  update({ completed: !todo.completed })
}
const onNewClick = () => {
  const create = actions.save()
  create({ text: 'New todo' })
}
```

#### PUT

When you configure it with an `id`, it will send a request to `PUT /todos/:id` (unless you set the `path` param) with your provided `data` as request body.

It will store the result on `saved` unless it is still requesting (`saving`) or the request caused an error (`saveError`).

Calling it this way is equivalent to what the APIs call `CHANGE/UPDATE`.

```
const { saved, saving, saveError } = state
```

#### POST

When you **don't** pass an `id`, it will send a request to `POST /todos` (unless you set the `path` param) with your provided `data` as request body.

It will store the result on `saved` unless it is still requesting (`saving`) or the request caused an error (`saveError`).

Calling it this way is equivalent to what the APIs call `NEW/CREATE`.

```
const { saved, saving, saveError } = state
```

#### Result

The `return` of `save` will depend on if the request succeeds. If it does, you'll get the server response when the Promise resolves and also the component will be rerendered with the new `state.saved`. Otherwise the Promise will resolve to `false` and the component will be rerendered with the `state.saveError` message from the API:

```
const { saving, saved, saveError } = state
const label = saving ? 'Saving Todo...' : 'Save Todo!';

return (
  <div>
    <button onClick={async () => {
      const data = await actions.save(todo.id)({ completed: !todo.completed })
      data ? alert(data) : alert('Failed!')
    }}>
      {label}
    </button>
    {saveError && <span>{saveError}</span>}
  </div>
)
```

## destroy

**Format:** `id => () => Promise(object | false)`

The destroy action will controll the `DELETE` requests and everything related to `state.destroy`.

#### Params

This method is configured by calling it with `id` and then called again to execute the request.

```
const [, { destroy }] = useCroods({ name: 'todos' })
const destroyId1 = destroy(1)
const onTodoClick = todo => {
  destroy(todo.id)()
}
```

It must be configured with an `id` otherwise the request will not be sent. It will send a request to `DELETE /todos/:id` (unless you set the `path` param).

It will store the result on `destroyed` unless it is still requesting (`destroying`) or the request caused an error (`destroyError`).

Calling it this way is equivalent to what the APIs call `DELETE/DESTROY/REMOVE`.

```
const { destroyed, destroying, destroyError } = state
```

#### Workaround

If for any reason you don't have an `id` to send it, just do something like this:

```
const [, { destroy }] = useCroods({ name: 'auth', path: 'auth/sign_out' })
return <button onClick={destroy(true)}>Log out</button>
```

The code above will send a `DELETE /auth/sign_out`.

#### Result

The `return` of `destroy` will depend on if the request succeeds. If it does, you'll get the server response when the Promise resolves and also the component will be rerendered with the new `state.destroyed`. Otherwise the Promise will resolve to `false` and the component will be rerendered with the `state.destroyError` message from the API.

# Setters

There are 2 actions that don't dispatch any request, they just change the current state on the client-side for convenience.

It is important for when you change something in the server and you want to reflect those changes immediately.

## setInfo

**Format:** `(object, bool) => object`

The setInfo action will change `state.info`.

```
const [{ info: user }, { setInfo: setUser }] = useCroods({ name: 'auth' })
const signOut = () => {
  myApi.signOut().then(() => setUser(null))
}
```

If you just want to change few properties, not replacing the whole object, you can send `true` as the second parameter (called `merge`) to `setInfo`:

```
const [{ info: user }, { setInfo: setUser }] = useCroods({ name: 'auth' })
const onClick = () => setUser({ active: !user.active }, true)
```

## setList

**Format:** `([object], bool) => [object]`

The setList action will change `state.list`.

```
const [, { setList }] = useCroods({ name: 'todos' })
const clearAll = () => {
  myApi.removeUser().then(() => setList([]))
}
```

You can send `true` as the second parameter (called `merge`) to `setList` if you want to `concat` other items to the end of your `list`:

```
const [{ list }, { setList }] = useCroods({ name: 'todos' })
console.log(list.length) // 4;
const getNew = () => {
  socket.getNewTodos().then(() => setList(['foo', 'bar'], true))
  // Component will be rerendered with 6 items on list
}
```
