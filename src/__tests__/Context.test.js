import React from 'react'
import renderer from 'react-test-renderer'

import Context from '../Context'

it('renders correctly', () => {
  const props = {
    baseUrl: 'https://api.foobar.com'
  }
  const tree = renderer.create(<Context {...props}><div>Foobar</div></Context>).toJSON()
  expect(tree).toMatchSnapshot()
})
