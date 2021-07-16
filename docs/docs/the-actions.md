---
id: the-actions
title: Croods Actions
---

In order to access the Croods actions and be able to fetch/save/destroy data as well as changing Croods state, you need to grab the `actions` object from a [Croods Tuple](/docs/main-concepts#the-croods-tuple):

```
const [state, actions] = useCroods({ name: 'images' })

// You can also get it from the Fetch component:
<Fetch
  name="foo"
  render={(list, [state, actions]) => ... }
/>
```

Now you can use all of the following actions:

```
const { fetch, save, destroy, setInfo, setList, dangerouslyResetCroodsState } = actions
```

## fetch

**Format:** `object? => object? => Promise(object | false)`

The fetch action will controll the `GET` requests and everything related to `state.list` or `state.info`.

#### Params

This method is configured by calling it with a `config` param, an object with everything you could config on [`useCroods`](/docs/use-croods-api) and then called again with two optional arguments, the [query object](/docs/use-croods-api#query) that will be converted to a queryString and the `requestConfig object` that will customize the request ([See the options here](https://github.com/axios/axios#request-config)).

#### Info

When you pass an `id` param to your config, it will send a request to `GET /colors/:id` (unless you set the `path` param) expecting to receive a **single item** back from the API.

It will store this item on `info` unless it is still requesting (`fetchingInfo`) or the response was an error (`infoError`).

Calling it this way is equivalent to what the APIs name as `INFO/SHOW/GET`.

```
const { fetchingInfo, info, infoError } = state
```

If you didn't set an `id`, you can still dispatch a `GET info` by changing the `operation` param:

```
useEffect(() => {
  fetch({ operation: 'info' })({ item: 1 })
}, [])
```

#### List

If you **don't** pass an `id` param, it will send a request to `GET /colors` (unless you set the `path` param) expecting to receive an **array of items** back from the API.

It will store this item on `list` unless it is still requesting (`fetchingList`) or the response was an error (`listError`).

Calling it this way is equivalent to what the APIs name as `INDEX/LIST/FIND`.

```
const { fetchingList, list, listError } = state
```

If you set an `id`, you can still dispatch a `GET list` by changing the `operation` param:

```
useEffect(() => {
  fetch({ id: 2, operation: 'list' })()
}, [])
```

#### Result

The `return` of `fetch` will depend on if the request succeeds. If it does, you'll get the item/list when the Promise resolves and the component will be rerendered with the new state. Otherwise the Promise will resolve to `false` and the component will be rerendered with the error message from the API:

```
const { fetchingList, list, listError } = state
const label = fetchingList ? 'Getting List...' : 'Get List!';

return (
  <div>
    <button onClick={async () => {
      const data = await actions.fetch()()
      data ? alert(data) : alert('Failed!')
    }}>
      {label}
    </button>
    {listError && <span>{listError}</span>}
  </div>
)
```

#### The query parameter

The second parameter is used on `GET` and `DELETE` requests, when you want to send query parameters (parameters on your URL).

It will convert a given object with numbers, strings and array values to a [queryString](https://en.wikipedia.org/wiki/Query_string) format:

```
const [, { fetch }] = useCroods({
  name: 'todos',
})
useEffect(() => {
  fetch()({ page: 2, tags: ['red', 'yellow']})
}, [])
// GET /todos?page=2&tags[]=red&tags[]=yellow
```

## save

**Format:** `object? => object => Promise(object | false)`

The save action will controll the `POST` and `PUT` requests and everything related to `state.save`.

#### Params

This method is configured by calling it with a `config` param, an object with everything you could config on [`useCroods`](/docs/use-croods-api), plus two parameters: `onProgress`, a function which you can pass to handle the request progress (usually for uploads), and `addToTop`, that if set to true will add the created object at the top of the state list. Then you call the method again with the data to be sent to the server. 

NOTE: Although unlikely, if you need to configure the underlying axios request even further, you can provide a `requestConfig object` inside the `config` object, with the options to be used in the request. ([See the options here](https://github.com/axios/axios#request-config).
```
const [state, actions] = useCroods({ name: 'todos' })
const onTodoClick = todo => {
  const update = actions.save({ id: todo.id })
  update({ completed: !todo.completed })
}
const onNewClick = () => {
  const create = actions.save()
  create({ text: 'New todo' })
}
```

#### PUT

When you configure it with an `id`, it will send a request to `PUT /todos/:id` (unless you set the `path` param) with your provided `data` as request body.

It will update the `state.info` with current data if there is no other record being stored there. If `state.info` is null, this result will be stored there. It'll also change the `state.saving` if it is requesting or `state.saveError` if the request caused an error.

Calling it this way is equivalent to what the APIs name as `CHANGE/UPDATE`.

```
const { saving, saveError } = state
```

You can override the HTTP method, though:

```
const patch = actions.save({ method: 'PATCH', id: 2 })
const update = actions.save({ method: 'PUT' })
```

#### POST

When you **don't** pass an `id`, it will send a request to `POST /todos` (unless you set the `path` param) with your provided `data` as request body.

It will update the `state.info` with current data if there is no other record being stored there. If `state.info` is null, this result will be stored there. It'll also change the `state.saving` if it is requesting or `state.saveError` if the request caused an error.

Calling it this way is equivalent to what the APIs name as `NEW/CREATE`.

```
const { saving, saveError } = state
```

You can override the HTTP method, though:

```
const postUpdate = actions.save({ method: 'POST', id: 2 })
```

#### Result

The `return` of `save` will depend on if the request succeeds. If it does, you'll get the server response when the Promise resolves. Otherwise the Promise will resolve to `false` and the component will be rerendered with the `state.saveError` message from the API:

```
const { saving, saveError } = state
const label = saving ? 'Saving Todo...' : 'Save Todo!';

return (
  <div>
    <button onClick={async () => {
      const data = await actions.save({ id: todo.id })({ completed: !todo.completed })
      data ? alert(data) : alert('Failed!')
    }}>
      {label}
    </button>
    {saveError && <span>{saveError}</span>}
  </div>
)
```

## destroy

**Format:** `object? => object? => Promise(object | false)`

The destroy action will controll the `DELETE` requests and everything related to `state.destroy`.

#### Params

This method is configured by calling it with a `config` param, an object with everything you could config on [`useCroods`](/docs/use-croods-api) and then called again with two optional arguments, the [query object](/docs/use-croods-api#query) that will be converted to a queryString and the `requestConfig object` that will customize the request ([See the options here](https://github.com/axios/axios#request-config)).

```
const [, { destroy }] = useCroods({ name: 'todos' })
const destroyId1 = destroy({ id: 1 })
const onTodoClick = todo => {
  destroy({ id: todo.id })({ 'keep_record': true })
  // DELETE /todos/1?keep_record=true
}
```

It will send a request to `DELETE /todos/:id` (unless you set the `path` or `customPath` params).

It will change the `state.destroying` when it is requesting or `state.destroyError` when the request caused an error.

The Promise returns the destroyed object in case it was successfull and the object was previously in the `state.list`.

Calling it this way is equivalent to what the APIs name as `DELETE/DESTROY/REMOVE`.

```
const { destroying, destroyError } = state
```

#### Result

The `return` of `destroy` will depend on if the request succeeds. If it does, the Promise will return the destroyed object if it was previously on `state.list`. Otherwise the Promise will resolve to `false` and the component will be rerendered with the `state.destroyError` message from the API.

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

# Clearing state

## Dangerously Reset Croods State

**Format:** `() => void`

This action completely wipes Croods state, replacing it with an empty object `{}`. 

As the name implies, it's a destructive and dangerous operation in the front-end.

```
const [{}, { dangerouslyResetCroodsState }] = useCroods({ name: 'auth' })
const signOut = () => {
  myApi.signOut().then(() => dangerouslyResetCroodsState())
}
```

No requests will be sent to the backend and the global Croods state will be set `{}`