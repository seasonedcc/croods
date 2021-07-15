import { useStore } from '../useStore'
import { renderHook, act } from '@testing-library/react-hooks'

const useGlobal = useStore(
  {
    fillState: store => {
      store.setState({
        foo: 'bar',
        baz: 'bat',
      })
    },
    cleanState: store => {
      store.resetState()
    },
  },
  {},
)

describe('useStore functions', () => {
  it('Sets state when given actions', () => {
    const { result } = renderHook(() => useGlobal())
    const [, { fillState }] = result.current

    expect(result.current[0]).toEqual({})

    act(() => {
      fillState()
    })

    expect(result.current[0]).toEqual({
      foo: 'bar',
      baz: 'bat',
    })
  })

  it('resets state correctly', () => {
    const { result } = renderHook(() => useGlobal())
    const [, { fillState, cleanState }] = result.current

    act(() => {
      fillState()
    })

    expect(result.current[0]).toEqual({
      foo: 'bar',
      baz: 'bat',
    })

    act(() => {
      cleanState()
    })

    expect(result.current[0]).toEqual({})
  })
})
