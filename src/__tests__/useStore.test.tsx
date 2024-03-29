import { Store, useStore } from '../useStore'
import { renderHook, act } from '@testing-library/react-hooks'

const useGlobal = useStore(
  {
    fillState: (store: Store) => {
      store.setState({
        foo: 'bar',
        baz: 'bat',
      })
    },
    cleanState: (store: Store) => {
      store.clearState()
    },
  },
  {
    initial: 'state',
  },
)

describe('useStore functions', () => {
  it('Sets state when given actions', () => {
    const { result } = renderHook(() => useGlobal())
    const [, { fillState }] = result.current

    expect(result.current[0]).toEqual({
      initial: 'state',
    })

    act(() => {
      fillState()
    })

    expect(result.current[0]).toEqual({
      foo: 'bar',
      baz: 'bat',
      initial: 'state',
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
      initial: 'state',
    })

    act(() => {
      cleanState()
    })

    expect(result.current[0]).toEqual({})
  })
})
