import React from 'react'
import { Router } from '@reach/router'
import { CroodsProvider } from 'croods-light'

import List from './List'
import Info from './Info'
import Edit from './Edit'
import Create from './Create'
import './App.css'

const isDev = process.env.NODE_ENV === 'development'

const App = () => (
  <div className="App">
    <CroodsProvider
      baseUrl="https://reqres.in/api"
      cache
      debugActions
      debugRequests
      parseFetchResponse={({ data }) => data.data}
    >
      <Router basepath={isDev ? '' : 'croods-light'}>
        <List path="/" />
        <Create path="/new" />
        <Edit path="/:id/edit" />
        <Info path="/:id" />
      </Router>
    </CroodsProvider>
  </div>
)

export default App
