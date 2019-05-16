import React from 'react'
import ReactDOM from 'react-dom'
import { CroodsProvider } from 'croods'
import App from './App'

ReactDOM.render(
  <CroodsProvider
    baseUrl="https://reqres.in/api"
    cache
    debugActions
    debugRequests
    parseFetchResponse={({ data }) => data.data}
  >
    <App />
  </CroodsProvider>,
  document.getElementById('root'),
)
