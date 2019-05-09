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

- [`baseUrl`](/docs/croods-provider-api#baseurl) : Is your API root path, where all your endpoints are defined
- [`parseResponse`](/docs/croods-provider-api#parseresponse) : Every API returns data in a different JSON schema format, so in this function you must take the returned JSON and return the data you want to access.
- [`name`](/docs/fetch-api#name) : The endpoint in use for this component's requests.

Later on you will see how to set [project-wide defaults](/docs/project-defaults) and avoid repeating yourself.
