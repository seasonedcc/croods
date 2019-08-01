import React from 'react'
import renderer from 'react-test-renderer'

import { CProvider as Provider } from '../Context'

it('renders correctly', () => {
  const props = {
    baseUrl: 'https://api.foobar.com'
  }
  const tree = renderer.create(<Provider {...props}><div>Foobar</div></Provider>).toJSON()
  expect(tree).toMatchSnapshot()
})
