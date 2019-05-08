---
id: main-concepts
title: Main Concepts
---

## The Croods tuple

The MAIN concept of Croods is what it provides you every time you call `useCroods` or `Fetch`:

```
const [state, actions] = useCroods({ name: 'images' })
```

We are following the React hooks pattern of keeping the `state` on the first value of the tuple and the `action` that changes the `state` on the later.

## State

Anything related to the data, the process of fetching/saving/destroying the data and the possible API errors is going to be stored in `state`. This object will have the following schema:

```
state = {
  destroyed: null,
  destroyError: null,
  destroying: false,
  fetchingInfo: false,
  fetchingList: false,
  info: null,
  infoError: null,
  list: [],
  listError: null,
  saved: null,
  saveError: null,
  saving: null,
}
```

This piece of state is going to be changing every time you call an action, and when the action resolves, be it a failure or a success.

## Actions

The `actions` object will have the following structure:

```
actions = {
  fetch: id => {...},
  save: id => data => {...},
  destroy: id => () => {...},
  setInfo: data => {...},
  setList: data => {...},
}
```

The main 3 actions are: `fetch`, `save` and `destroy`. Those actions give you everything you need for any CRUD operation.

#### Fetch

If you want to fetch a list or a single item from the data base:

```
<button onClick={fetch} />
```

On the above example, when you click the button, a `GET` request will be dispatched at `${baseUrl}/images` to `GET` a list of images (AKA: index, list or find).
If you want to `GET` a single item, you should pass an id:

```
<button onClick={() => fetch(1)} />
```

On this example, when you click the button, a `GET` request will be dispatched at `${baseUrl}/images/1` to `GET` one image (AKA: show or info).

So, keep this in mind:

```
const fetchItem = () => fetch(id)
const fetchList = () => fetch()
```

#### Save

As for the `CREATE` and `UPDATE` you've got the `save` action:

```
<button onClick={() => save()({ src: 'foo.png' })} />
```

On the code above, when you click the button, a `POST` request will be dispatched at `${baseUrl}/images` to `CREATE` an image with data: `{ "src":"foo.png" }`.
If you want to `UPDATE` an item though, you should pass an id:

```
<button onClick={() => save(1)({ src: 'foo.png' })} />
```

Then you'll be sending a `PUT` request at `${baseUrl}/images/1` with data: `{ "src":"foo.png" }`.

So, if you really want to name your method you can do (or keep in mind) the following:

```
const update = save(id)
const create = save()
```

#### Destroy

As for the `DELETE` method you'll have the last action:

```
<button onClick={destroy(1)} />
```

This code will send a `DELETE` request to `${baseUrl}/images/1`. This action will only work if an `id` is given.

## The actions will be changing the state on the fly

So that first piece of state will be changing according to the API responses, for instance, when you click the first button `<button onClick={fetch} />`, `state.fetchingList` will be `true`.
When the request resolves you'll have the images at `state.list` and `state.fetchingList` will be `false` again.
