---
id: use-croods
title: The useCroods hook
---

This is the core of our tool, `useCroods` is used, under the hood, by any other component or tool that descend from The Croods Lib.

It receives one parameter, a list of options related to the requests you want to do and the state identifier on the global state object.

When you call this hook, you'll have access to [the Croods tuple](/docs/main-concepts#the-croods-tuple)

```
import React from 'react'
import { CroodsProvider } from 'croods-light'
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
