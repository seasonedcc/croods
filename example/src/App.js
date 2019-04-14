import React from 'react'
import { Router } from '@reach/router'

import List from './List'
import Info from './Info'
import Edit from './Edit'
import Create from './Create'
import './App.css'

const App = () => (
  <div className="App">
    <Router>
      <List path="/" />
      <Create path="/new" />
      <Edit path="/:id/edit" />
      <Info path="/:id" />
    </Router>
  </div>
)

export default App
