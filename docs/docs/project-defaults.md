---
id: project-defaults
title: Project defaults
---

For your convenience, you can define these and other configuration for your whole app at the topmost node of your application using `CroodsProvider` like so:

```
import React from 'react'
import { CroodsProvider } from 'croods'
import App from './App'

export default props => (
  <CroodsProvider
    baseUrl="https://dog.ceo/api/breed/beagle"
    parseResponse={({ data }) => data.message}
  >
    <App />
  </CroodsProvider>
)

```

In the parseResponse props, we are telling Croods how to handle API responses to our Fetch component. Croods will always return the `response` object with headers, data, etc. In this example, our API returns a json like this:

```
{
  "status": "success",
  "message": [
    "https://images.dog.ceo/breeds/beagle/n02088364_10108.jpg",
    "https://images.dog.ceo/breeds/beagle/n02088364_10206.jpg"
  ]
}

```

Given that the list we want is inside "messages", all we need to do is passing a function to extract that list from the `response.data`.

```
parseResponse={response => response.data.message}

```

Then inside the `App` component, we can create our Fetch component with less configuration:

```
<Fetch
  name="images"
  render={list => (
    <div>
      <h1>Hello Beagles!</h1>
      <ul>
        {list.map((item, index) => (
          <li key={index}>
            <img src={item} alt={Beagle  ${index)`}/>
          </li>
        ))}
      </ul>
    </div>
  )}
/>

```

The `name` prop defines path to your global state (the one you'll have access throughout your app as we'll see later). It will also defined the endpoint in case you omit the path prop. If you want to set your own path and attribute the response data to other piece of state, let's say: `beagles`, you can do the following:

```
<Fetch
  name="beagles"
  path=images"
  //...
/>

```

The `path` prop defines the endpoint relative to baseUrl passed to CroodsProvider. Both approaches above will make a `GET` request at `https://dog.ceo/api/breed/beagle/images`.

The last prop is `render`, which, as the name implies, is a function defining the component's children. It receives the images array as a first parameter from Fetch and must return a React element.
