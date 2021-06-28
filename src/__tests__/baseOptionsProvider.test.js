import React from 'react'
import { render } from '@testing-library/react'

import { CroodsProvider, useBaseOptions } from '../baseOptionsProvider'

const Component = () => {
  const options = useBaseOptions()
  return JSON.stringify(options)
}

describe('useBaseOptions hook', () => {
  it('returns an empty object when used outside of a CroodsProvider', () => {
    const screen = render(<Component />)
    expect(screen.container.innerHTML).toBe('{}')
  })

  it('returns the options when used within a CroodsProvider', () => {
    const screen = render(
      <CroodsProvider
        baseUrl="https://api.foobar.com"
        credentials={{ username: 'foo', password: 'secret' }}
      >
        <Component />
      </CroodsProvider>,
    )
    expect(screen.container.innerHTML).toMatchInlineSnapshot(
      `"{\\"baseUrl\\":\\"https://api.foobar.com\\",\\"credentials\\":{\\"username\\":\\"foo\\",\\"password\\":\\"secret\\"}}"`,
    )
  })
})
