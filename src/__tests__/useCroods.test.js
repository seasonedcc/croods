import { renderHook, act } from '@testing-library/react-hooks'
import { initialState } from '../initialState'

import { buildApi } from '../buildApi'
import { useCroods } from '../useCroods'

afterEach(jest.clearAllMocks)

const user = { id: 1 }
jest.mock('../buildApi')

beforeEach(() => {
  buildApi.mockImplementation(() =>
    Promise.resolve(() => Promise.resolve({ data: { user } })),
  )
})

describe('useCroods hook', () => {
  describe('instance configuration', () => {
    it('should return a default state', () => {
      const { result } = renderHook(() =>
        useCroods({ name: 'users', stateId: 1 }),
      )
      const [state] = result.current
      expect(state).toEqual(initialState)
    })

    it('should return a set of actions', () => {
      const { result } = renderHook(() =>
        useCroods({ name: 'users', stateId: 1 }),
      )
      const [, actions] = result.current
      expect(actions.fetch).toBeDefined()
      expect(actions.save).toBeDefined()
      expect(actions.destroy).toBeDefined()
      expect(actions.setInfo).toBeDefined()
      expect(actions.setList).toBeDefined()
    })
  })

  describe('Croods Action: Fetch with ID', () => {
    it('resolves gracefully', async () => {
      const { result } = renderHook(() =>
        useCroods({ name: 'fetchuser', stateId: 'success' }),
      )
      const [, actions] = result.current
      let response
      await act(async () => {
        response = await actions.fetch({ id: 1 })()
      })
      const [{ info, list, fetchingInfo, infoError, fetchingList }] =
        result.current
      expect(info.user).toEqual(user)
      expect(list).toEqual([])
      expect(fetchingInfo).toEqual(false)
      expect(fetchingList).toEqual(false)
      expect(infoError).toEqual(null)
      expect(response).toEqual({ user })
    })

    it('fails gracefully', async () => {
      buildApi.mockImplementation(() =>
        Promise.resolve(() => Promise.reject(new Error('No data'))),
      )
      const { result } = renderHook(() =>
        useCroods({ name: 'fetchuser', stateId: 'error' }),
      )
      const [, actions] = result.current
      let response
      await act(async () => {
        response = await actions.fetch({ id: 1 })()
      })
      const [{ info, infoError, listError, fetchingInfo, fetchingList }] =
        result.current
      expect(info).toEqual(null)
      expect(fetchingInfo).toEqual(false)
      expect(fetchingList).toEqual(false)
      expect(infoError).toEqual('No data')
      expect(listError).toEqual(null)
      expect(response).toBe(false)
    })

    it('loads gracefully', async () => {
      buildApi.mockImplementation(() =>
        Promise.resolve(() => new Promise(() => ({}))),
      )
      const { result, waitForValueToChange } = renderHook(() =>
        useCroods({ name: 'fetchuser', stateId: 'loading' }),
      )
      const [, actions] = result.current
      actions.fetch({ id: 1 })()
      await waitForValueToChange(() => result.current[0].fetchingInfo)
      const [{ fetchingInfo, infoError, fetchingList }] = result.current
      expect(fetchingInfo).toBe(true)
      expect(fetchingList).toBe(false)
      expect(infoError).toBe(null)
    })
  })

  describe('Croods Action: Fetch without ID', () => {
    it('resolves gracefully', async () => {
      buildApi.mockImplementation(() =>
        Promise.resolve(() => Promise.resolve({ data: [user] })),
      )
      const { result } = renderHook(() =>
        useCroods({ name: 'fetchusers', stateId: 'success' }),
      )
      const [, actions] = result.current
      let response
      await act(async () => {
        response = await actions.fetch({})()
      })
      const [{ info, list, fetchingInfo, infoError, fetchingList }] =
        result.current
      expect(list).toEqual([user])
      expect(info).toEqual(null)
      expect(fetchingInfo).toEqual(false)
      expect(fetchingList).toEqual(false)
      expect(infoError).toEqual(null)
      expect(response).toEqual([user])
    })

    it('fails gracefully', async () => {
      buildApi.mockImplementation(() =>
        Promise.resolve(() => Promise.reject(new Error('No data'))),
      )
      const { result } = renderHook(() =>
        useCroods({ name: 'fetchusers', stateId: 'error' }),
      )
      const [, actions] = result.current
      let response
      await act(async () => {
        response = await actions.fetch({})()
      })
      const [{ info, list, infoError, listError, fetchingInfo, fetchingList }] =
        result.current
      expect(info).toEqual(null)
      expect(list).toEqual([])
      expect(fetchingInfo).toEqual(false)
      expect(fetchingList).toEqual(false)
      expect(listError).toEqual('No data')
      expect(infoError).toEqual(null)
      expect(response).toBe(false)
    })

    it('loads gracefully', async () => {
      buildApi.mockImplementation(() =>
        Promise.resolve(() => new Promise(() => [])),
      )
      const { result, waitForValueToChange } = renderHook(() =>
        useCroods({ name: 'fetchusers', stateId: 'loading' }),
      )
      const [, actions] = result.current
      actions.fetch({})()
      await waitForValueToChange(() => result.current[0].fetchingList)
      const [{ fetchingInfo, listError, fetchingList }] = result.current
      expect(fetchingInfo).toBe(false)
      expect(fetchingList).toBe(true)
      expect(listError).toBe(null)
    })
  })

  describe('Croods Action: Save', () => {
    it('resolves gracefully', async () => {
      const { result } = renderHook(() =>
        useCroods({ name: 'saveuser', stateId: 'success' }),
      )
      const [, actions] = result.current
      let response
      await act(async () => {
        response = await actions.save({ id: 1 })()
      })
      const [{ info, saveError, saving }] = result.current
      expect(info.user).toEqual(user)
      expect(saving).toEqual(false)
      expect(saveError).toEqual(null)
      expect(response).toEqual({ user })
    })

    it('fails gracefully', async () => {
      buildApi.mockImplementation(() =>
        Promise.resolve(() => Promise.reject(new Error('No data'))),
      )
      const { result } = renderHook(() =>
        useCroods({ name: 'saveuser', stateId: 'error' }),
      )
      const [, actions] = result.current
      let response
      await act(async () => {
        response = await actions.save({ id: 1 })()
      })
      const [{ info, saveError, saving }] = result.current
      expect(info).toEqual(null)
      expect(saveError).toEqual('No data')
      expect(saving).toEqual(false)
      expect(response).toBe(false)
    })

    it('loads gracefully', async () => {
      buildApi.mockImplementation(() =>
        Promise.resolve(() => new Promise(() => ({}))),
      )
      const { result, waitForValueToChange } = renderHook(() =>
        useCroods({ name: 'saveuser', stateId: 'loading' }),
      )
      const [, actions] = result.current
      actions.save({ id: 1 })()
      await waitForValueToChange(() => result.current[0].saving)
      const [{ saving, saveError }] = result.current
      expect(saving).toBe(true)
      expect(saveError).toBe(null)
    })
  })

  describe('Croods Action: Destroy', () => {
    it('resolves gracefully', async () => {
      const { result } = renderHook(() =>
        useCroods({ name: 'destroyUser', stateId: 'success' }),
      )
      const [, actions] = result.current
      let response
      await act(async () => {
        response = await actions.destroy({ id: 1 })()
      })
      const [{ info, destroyError, destroying }] = result.current
      expect(info).toEqual(null)
      expect(destroying).toEqual(false)
      expect(destroyError).toEqual(null)
      expect(response).toEqual()
    })

    it('fails gracefully', async () => {
      buildApi.mockImplementation(() =>
        Promise.resolve(() => Promise.reject(new Error('No data'))),
      )
      const { result } = renderHook(() =>
        useCroods({ name: 'destroyUser', stateId: 'error' }),
      )
      const [, actions] = result.current
      let response
      await act(async () => {
        response = await actions.destroy({ id: 1 })()
      })
      const [{ info, destroyError, destroying }] = result.current
      expect(info).toEqual(null)
      expect(destroyError).toEqual('No data')
      expect(destroying).toEqual(false)
      expect(response).toBe(false)
    })

    it('loads gracefully', async () => {
      buildApi.mockImplementation(() =>
        Promise.resolve(() => new Promise(() => ({}))),
      )
      const { result, waitForValueToChange } = renderHook(() =>
        useCroods({ name: 'destroyUser', stateId: 'loading' }),
      )
      const [, actions] = result.current
      actions.destroy({ id: 1 })()
      await waitForValueToChange(() => result.current[0].destroying)
      const [{ destroying, destroyError }] = result.current
      expect(destroying).toBe(true)
      expect(destroyError).toBe(null)
    })
  })

  describe('Croods Action: Set Info', () => {
    it('can change the info on croods state', () => {
      const { result } = renderHook(() => useCroods({ name: 'setInfo' }))
      const [, actions] = result.current
      act(() => {
        actions.setInfo(user)
      })
      const [{ info }] = result.current
      expect(info).toEqual(user)
    })

    it('can merge information with info in state', () => {
      const { result } = renderHook(() => useCroods({ name: 'setInfo' }))
      const [, actions] = result.current
      act(() => {
        actions.setInfo(user)
      })
      expect(result.current[0].info).toEqual(user)
      act(() => {
        actions.setInfo({ lastName: 'Doe' }, true)
      })
      expect(result.current[0].info).toEqual({ id: 1, lastName: 'Doe' })
    })
  })

  describe('Croods Action: Set List', () => {
    it('can change the list on croods state', () => {
      const { result } = renderHook(() => useCroods({ name: 'setInfo' }))
      const [, actions] = result.current
      act(() => {
        actions.setList([user])
      })
      const [{ list }] = result.current
      expect(list).toEqual([user])
    })

    it('can merge information with list in state', () => {
      const user2 = { id: 2 }
      const { result } = renderHook(() => useCroods({ name: 'setInfo' }))
      const [, actions] = result.current
      act(() => {
        actions.setList([user])
      })
      expect(result.current[0].list).toEqual([user])
      act(() => {
        actions.setList([user2], true)
      })
      expect(result.current[0].list).toEqual([user, user2])
    })
  })
})
