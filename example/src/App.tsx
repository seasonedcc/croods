import React from 'react'
import { Router } from '@reach/router'

import List from './List'
import Info from './Info'
import Edit from './Edit'
import Create from './Create'
import basePath from './basePath'
import './App.css'
import { CroodsStateFlags } from '../../src/typeDeclarations'

export type Color = CroodsStateFlags & {
  id: string
  color: string
  name: string
}
const App = (): JSX.Element => (
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
