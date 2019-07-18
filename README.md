# Croods

Croods is a library that abstracts the REST data layer of your back-end providing you a simple API to integrate it with react applications. A simple "Hello world" would look like this:

## Install

```bash
yarn add croods react react-dom lodash axios
```

## Usage

```js
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

[Check out the docs](https://croods.netlify.com) to understand more about it!
