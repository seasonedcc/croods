import React from 'react'
import renderer from 'react-test-renderer'

import { CroodsProvider } from '../Context'

it('renders correctly', () => {
  const props = {
    baseUrl: 'https://api.foobar.com',
  }
  const tree = renderer
    .create(
      <CroodsProvider {...props}>
        <div>Foobar</div>
      </CroodsProvider>,
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
