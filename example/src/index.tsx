import ReactDOM from 'react-dom'
import kebabCase from 'lodash/kebabCase'
import { CroodsProvider } from 'croods'
import App from './App'

type ResponseData = {
  data: {
    data: any
  }
}

ReactDOM.render(
  <CroodsProvider
    baseUrl="https://reqres.in/api"
    cache
    debugActions
    debugRequests
    parseFetchResponse={({ data }: ResponseData) => data.data}
    queryStringParser={kebabCase}
  >
    <App />
  </CroodsProvider>,
  document.getElementById('root'),
)
