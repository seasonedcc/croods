---
id: main-concepts
title: Main Concepts
---

## The Croods tuple

The **main** concept of Croods is what it provides you every time you call `useCroods` or `Fetch`:

```
const [state, actions] = useCroods({ name: 'images' })
```

We are following the React hooks pattern of keeping the `state` on the first value of the tuple and the `action` that changes the `state` on the later.

## State

Any state related to the data, the process of fetching/saving/destroying the data and the possible API errors is going to be stored in `state`. This object will have the following schema:

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
  fetch: config => query => {...},
  save: config => data => {...},
  destroy: config => query => {...},
  setInfo: data => {...},
  setList: data => {...},
}
```

The main 3 actions are: `fetch`, `save` and `destroy`. Those actions give you everything you need for any CRUD operation.

#### Fetch

If you want to fetch a list or a single item from the database:

```
<button onClick={fetch()} />
```

On the above example, when you click the button, a `GET` request will be dispatched at `${baseUrl}/images` to `GET` a list of images (AKA: index, list or find).
If you want to `GET` a single item, you should pass an id:

```
<button onClick={fetch({ id: 1 })} />
```

On this example, when you click the button, a `GET` request will be dispatched at `${baseUrl}/images/1` to `GET` one image (AKA: show or info).

So, keep this in mind:

```
const fetchItem = fetch({ id: 'truthyValue' })
const fetchList = fetch() // same as { id: 'false/null/undefined' }
```

You can [override this behavior](/docs/the-actions#fetch) though.

#### Save

As for the `CREATE` and `UPDATE` you've got the `save` action:

```
<button onClick={() => save()({ src: 'foo.png' })} />
```

On the code above, when you click the button, a `POST` request will be dispatched at `${baseUrl}/images` to `CREATE` an image with data: `{ "src":"foo.png" }`.
If you want to `UPDATE` an item though, you should pass an id:

```
<button onClick={() => save({ id: 1 })({ src: 'foo.png' })} />
```

Then you'll be sending a `PUT` request at `${baseUrl}/images/1` with data: `{ "src":"foo.png" }`.

So, if you really want to name your method you can do (or keep in mind) the following:

```
const update = save({ id: 'truthyValue' })
const create = save() // same as { id: 'false/null/undefined' }
```

You can [override this behavior](/docs/the-actions#save) though.

#### Destroy

Lastly, for the `DELETE` method you'll have the `destroy` action:

```
<button onClick={destroy({ id: 1 })} />
```

This code will send a `DELETE` request to `${baseUrl}/images/1`.

## The actions will be changing the state on the fly

So that first piece of state will be changing according to the API responses, for instance, when you click the first button `<button onClick={fetch()} />`, `state.fetchingList` will be `true`.
When the request resolves you'll have the images at `state.list` and `state.fetchingList` will be `false` again.

## Configuring your requests

Another very important concept is about how and where to configure your requests.

As we've already seen, you can setup [project defaults](/docs/project-defaults) for every request under [`CroodsProvider`](/docs/croods-provider-api).

Then, on every instance of Croods ([`useCroods`](/docs/use-croods-api)/[`Fetch`](/docs/fetch-api)) you can also setup configuration through an object (for the `useCroods` hook) or props (for the `Fetch` component).

If you want more specificity though, you can pass any configuration from `CroodsProvider` and `useCroods/Fetch` into an action's first parameter (`config`). This is valid for `fetch`, `save` and `destroy`.

```
<CroodsProvider afterSuccess={() => console.log('From Provider')}>
  <Fetch
    afterSuccess={() => console.log('From Fetch')}
    name="todos"
    cache={false}
    render={(list, [, { destroy }]) => {
      return list.map(item => (
        <button key={item.id} onClick={() => {
          destroy({
            id: item.id,
            afterSuccess: () => console.log('From the action'),
          })()
        }}>Delete</button>
      ))
    }}
  />
</CroodsProvider>
```

On the example above, you wouldn't see the `From Provider` log because `Fetch` is overriding it (for everything underneath the `Fetch` itself).

When the component mounts and the `Fetch` fetches the list with success, you'd see: `From Fetch` log.

After clicking on the delete button, though, you'd see: `From the action` log but no `From Fetch` because the action takes precedence over the instance.

Checkout this running sample below (open your JS console to see the logs):

<iframe src="https://codesandbox.io/embed/2xv71mnnzr?fontsize=14" title="2xv71mnnzr" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>
