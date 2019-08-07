import React from 'react'
import renderer from 'react-test-renderer'

import Fetch from '../Fetch'

let mockState = {}
const mockActions = {
  fetch: jest.fn(() => jest.fn()),
}
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
    expect(tree).toMatchSnapshot()
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
