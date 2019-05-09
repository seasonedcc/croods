---
id: introduction
title: Introduction
---

Croods is a library that abstracts the REST data layer of your back-end, providing you a simple API to integrate it with react applications. A simple "Hello world" would look like this:

```
// src/App.js

import React from 'react'
import { Fetch } from 'croods'

export default props => (
  <Fetch
    baseUrl="https://dog.ceo/api/breed/beagle"
    name="images"
    parseResponse={response => response.data.message}
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
)

```

Let's take a quick look through the code to understand what is going on.

1. We are using the [Fetch](/docs/the-fetch) component to fetch the [Dog API](https://dog.ceo/dog-api/) for a list of Beagle pictures.
2. This list is received in the `render` prop, where we display the images in a simple manner.

Also, that are 3 key configurations we defined here in order to interact with the API:

- [`baseUrl`](/docs/croods-provider-api#baseurl) : Is our API root path, where all endpoints are defined
- [`parseResponse`](/docs/croods-provider-api#parseresponse) : Every API returns data in a different JSON schema format, so in this function we must take the returned JSON and return the data we want to access.
- [`name`](/docs/fetch-api#name) : The global state in use for this component and the default [path](/docs/fetch-api#path) to the endpoint, since we didn't set one specifically (more on that bellow).

Later on you will see how to set [project-wide defaults](/docs/project-defaults) and avoid repeating yourself, but first lets be sure we got it clear.

With `baseUrl` prop we are defining our API url.
With `parseResponse`, we are telling Croods how to handle API responses to our Fetch component. Croods will always return the `response` object with headers, data, etc. In this example, our API returns a json like this:

```
{
  "status": "success",
  "message": [
    "https://images.dog.ceo/breeds/beagle/n02088364_10108.jpg",
    "https://images.dog.ceo/breeds/beagle/n02088364_10206.jpg"
  ]
}

```

Given that the list we want is inside "messages", all we need is a function to extract that list from the `response.data`.

```
parseResponse={response => response.data.message}

```


The `name` prop defines path to our global state (the one we'll have access throughout the app as we'll see later). It is also define the endpoint as, in this case, we omitted the `path` prop. If we wanted to set our own path and attribute the response data to other piece of state, let's say: `beagles`, we could do the following:

```
<Fetch
  name="beagles"
  path=images"
  //...
/>

```

The `path` prop defines the endpoint relative to baseUrl passed to CroodsProvider. Both approaches above will make a `GET` request at `https://dog.ceo/api/breed/beagle/images`.

And lastly, there is the `render` prop, which, as the name implies, is a function defining the component's children. It receives the images array as a first parameter from Fetch and must return a React element.
