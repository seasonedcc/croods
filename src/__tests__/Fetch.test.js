import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import { Fetch } from '../Fetch'

let mockState = {}
const mockActions = {
  fetch: jest.fn(() => jest.fn()),
}
beforeEach(() => {
  jest.clearAllMocks()
  mockState = {}
})
jest.mock('../useCroods', () => ({ useCroods: () => [mockState, mockActions] }))

describe('Fetch Component', () => {
  const props = {
    id: 1,
    name: 'foobar',
    render: () => <div>Rendered</div>,
  }
  describe('with error', () => {
    it('renders correctly', () => {
      mockState = {
        infoError: 'Error foobar',
      }
      render(<Fetch {...props} />)
      expect(screen.getByText(/error foobar/i)).toBeInTheDocument()
    })
  })

  describe('while is loading', () => {
    it('renders correctly', () => {
      mockState = {
        fetchingInfo: true,
      }
      render(<Fetch {...props} />)
      expect(screen.getByText(/loading.../i)).toBeInTheDocument()
    })

    it('does not render loading if fetching list and showing info', () => {
      mockState = {
        fetchingList: true,
      }
      render(<Fetch {...props} />)
      expect(screen.queryByText(/loading.../i)).not.toBeInTheDocument()
    })

    it('does not render loading if fetching info and showing list', () => {
      mockState = {
        fetchingInfo: true,
      }
      render(<Fetch {...props} id={undefined} />)
      expect(screen.queryByText(/loading.../i)).not.toBeInTheDocument()
    })

    it('accepts a custom loader component', () => {
      mockState = {
        fetchingInfo: true,
      }
      render(<Fetch {...props} renderLoading={() => "I'm loading"} />)
      expect(screen.getByText(/i'm loading/i)).toBeInTheDocument()
    })
  })

  describe('when there is no information to show', () => {
    it('renders null if no renderEmpty is given', () => {
      mockState = {
        info: null,
      }
      const { container } = render(<Fetch {...props} />)
      expect(container.innerHTML).toBe('')
    })

    it('renders a custom renderEmpty if ID is given and there is no Info', () => {
      mockState = {
        info: null,
      }
      render(<Fetch {...props} renderEmpty={() => 'Empty'} />)
      expect(screen.getByText(/empty/i)).toBeInTheDocument()
    })

    it('renders a custom renderEmpty when no ID is given and there is no list', () => {
      mockState = {
        list: [],
      }
      render(<Fetch {...props} id={undefined} renderEmpty={() => 'Empty'} />)
      expect(screen.getByText(/empty/i)).toBeInTheDocument()
    })
  })

  describe('when there is info', () => {
    it('renders Info correctly', () => {
      mockState = {
        info: {
          id: 1,
          data: {
            foo: 'bar',
          },
        },
      }
      render(
        <Fetch
          {...props}
          render={({ id, data }) => (
            <div>
              {id} - {data.foo}
            </div>
          )}
        />,
      )
      expect(screen.getByText(/1 - bar/i)).toBeInTheDocument()
    })

    it('renders List correctly', () => {
      mockState = {
        list: ['Foo', 'Bar'],
      }
      render(
        <Fetch
          {...props}
          id={undefined}
          render={list => (
            <div>
              {list.map((item, idx) => (
                <span key={idx} role="listitem">
                  {item}
                </span>
              ))}
            </div>
          )}
        />,
      )
      const [first, second] = screen.getAllByRole(/listitem/i)
      expect(first).toHaveTextContent('Foo')
      expect(second).toHaveTextContent('Bar')
    })

    it('renders normally even if renderEmpty is provided', () => {
      mockState = {
        info: { id: 1 },
      }
      render(<Fetch {...props} renderEmpty={() => 'Empty'} />)
      expect(screen.queryByText(/empty/i)).not.toBeInTheDocument()
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
})
