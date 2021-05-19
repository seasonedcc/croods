import React from 'react'
import ReactDOM from 'react-dom'
import kebabCase from 'lodash/kebabCase'
import { CroodsProvider } from 'croods'
import App from './App'

ReactDOM.render(
  <CroodsProvider
    baseUrl="https://reqres.in/api"
    cache
    debugActions
    debugRequests
    parseFetchResponse={({ data }) => data.data}
    queryStringParser={kebabCase}
  >
    <App />
  </CroodsProvider>,
  document.getElementById('root'),
)
