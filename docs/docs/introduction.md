---
id: introduction
title: Introduction
---

Croods is a library that abstracts the REST data layer of your back-end to integrate with a react application. A simple "Hello world" would look like this:

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

The sample code above is fetching the Dog API to show a list of Beagle pictures.

Let's take a look through the code step by step to understand what is going on.

That are 2 key configurations we must define in order to interact with the API:

- `baseUrl` : Is your API root path, where all your endpoints are defined
- `parseResponse` : Every API returns data in a different JSON schema format, so in this function you must take the returned JSON and return the data you want to access.
