import React from 'react'
import { Router } from '@reach/router'

import List from './List'
import Info from './Info'
import Edit from './Edit'
import Create from './Create'
import basePath from './basePath'
import './App.css'

export type Color = {
  id: string
  color: string
  name: string
}
export type User = {
  id: string
  name: string
}
const App: React.FC = () => (
  <div className="App">
    <Router basepath={basePath}>
      <List path="/" />
      <Create path="/new" />
      <Edit path="/:id/edit" />
      <Info path="/:id" />
    </Router>
  </div>
)

export default App
