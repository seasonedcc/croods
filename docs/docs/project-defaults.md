---
id: project-defaults
title: Project defaults
---

For your convenience, you can define shared settings for your whole app at the topmost node of your application using [`CroodsProvider`](/docs/croods-provider-api) like so:

```jsx
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

Then inside the `App` component, you can create a Fetch component with less configuration:

```jsx
<Fetch
  name="images"
  render={list => (
    <div>
      <h1>Hello Beagles!</h1>
      <ul>
        {list.map((item, index) => (
          <li key={index}>
            <img src={item} alt={`Beagle-${index}`}/>
          </li>
        ))}
      </ul>
    </div>
  )}
/>

```
