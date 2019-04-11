import React, { useEffect } from 'react'
import { Router } from '@reach/router'
import useCroods from './useCroods'

import List from './List'
import Info from './Info'
import Edit from './Edit'
import Create from './Create'
import './App.css'

const App = () => {
  const [state, actions] = useCroods({ name: 'colors' })
  useEffect(() => {
    actions.fetch()
  }, [])
  return (
    <div className="App">
      <header className="App-header">
        <Router>
          <List actions={actions} {...state} path="/" />
          <Create path="/new" />
          <Edit path="/:id/edit" />
          <Info path="/:id" />
        </Router>
      </header>
    </div>
  )
}

export default App
