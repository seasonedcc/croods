import React from 'react'
import { Router } from '@reach/router'

import List from './List'
import Info from './Info'
import Edit from './Edit'
import Create from './Create'
import './App.css'

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <Router>
          <List path="/" />
          <Create path="/new" />
          <Edit path="/:id/edit" />
          <Info path="/:id" />
        </Router>
      </header>
    </div>
  )
}

export default App
