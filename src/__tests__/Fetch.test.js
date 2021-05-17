import React from 'react'
import renderer from 'react-test-renderer'
import { render } from '@testing-library/react'

import Fetch from '../Fetch'

let mockState = {}
const mockActions = {
  fetch: jest.fn(() => jest.fn()),
}

afterEach(() => {
  jest.clearAllMocks()
})

jest.mock('../useCroods', () => () => [mockState, mockActions])

const props = {
  id: 1,
  name: 'foobar',
  renderEmpty: () => <div>Empty</div>,
  render: () => <div>Rendered</div>,
}

describe('with error', () => {
  it('renders correctly', () => {
    mockState = {
      infoError: 'Error foobar',
    }
    const tree = renderer.create(<Fetch {...props} />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})

describe('while is loading', () => {
  it('renders correctly', () => {
    mockState = {
      fetchingInfo: true,
    }
    const tree = renderer.create(<Fetch {...props} />).toJSON()
    expect(tree.children[0]).toBe('Loading...')
  })

  it('does not render loading if fetching list and showing info', () => {
    mockState = {
      fetchingList: true,
    }
    const tree = renderer.create(<Fetch {...props} />).toJSON()
    expect(tree.children[0]).not.toBe('Loading...')
  })

  it('does not render loading if fetching info and showing list', () => {
    mockState = {
      fetchingInfo: true,
    }
    const tree = renderer.create(<Fetch {...props} id={undefined} />).toJSON()
    expect(tree.children[0]).not.toBe('Loading...')
  })
})

describe('with info', () => {
  it('renders correctly', () => {
    mockState = {
      info: {
        id: 1,
        data: {
          foo: 'bar',
        },
      },
    }
    const tree = renderer.create(<Fetch {...props} />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})

describe('when info is empty', () => {
  it('renders correctly', () => {
    mockState = {
      info: null,
    }
    const tree = renderer.create(<Fetch {...props} />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})

describe('fetching list', () => {
  const fetchListProps = { ...props, id: undefined }
  describe('when list is empty', () => {
    it('renders correctly', () => {
      mockState = {
        info: null,
        list: [],
      }
      const tree = renderer.create(<Fetch {...fetchListProps} />).toJSON()
      expect(tree).toMatchSnapshot()
    })
  })
})

describe('when changing properties', () => {
  it('should only fetch once if no property is changed', () => {
    const { rerender } = render(<Fetch {...props} />)
    rerender(<Fetch {...props} foo="bar" />)
    expect(mockActions.fetch).toHaveBeenCalledTimes(1)
  })

  it('should fetch when changing stateid', () => {
    const { rerender } = render(<Fetch {...props} />)
    rerender(<Fetch {...props} stateId="foobar" />)
    rerender(<Fetch {...props} query={{ foo: 'bar' }} stateId="foobar" />)
    rerender(
      <Fetch
        {...props}
        path="/foobar"
        query={{ foo: 'bar' }}
        stateId="foobar"
      />,
    )
    expect(mockActions.fetch).toHaveBeenCalledTimes(4)
  })
})
