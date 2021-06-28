import { shouldUseCache } from '../shouldUseCache'

beforeEach(jest.clearAllMocks)

describe('shouldUseCache', () => {
  const piece = { list: ['foo', 'bar'] }

  describe('when cache is true', () => {
    it('returns true if no ID was provided and there is already a list', () => {
      const setInfoFromList = jest.fn()
      const result = shouldUseCache({ cache: true })(
        null,
        piece,
        setInfoFromList,
      )
      expect(result).toBe(true)
    })

    it('returns true if ID was given and croods could find the item in the list', () => {
      const setInfoFromList = jest.fn(() => true)
      const result = shouldUseCache({ cache: true, foo: 'bar' })(
        10,
        piece,
        setInfoFromList,
      )
      expect(setInfoFromList).toHaveBeenCalledWith({ id: 10, foo: 'bar' })
      expect(result).toBe(true)
    })

    it('returns false if croods can not find the item in the list', () => {
      const setInfoFromList = jest.fn(() => false)
      const result = shouldUseCache({ cache: true, foo: 'bar' })(
        10,
        piece,
        setInfoFromList,
      )
      expect(result).toBe(false)
    })

    it('returns false if there is no items in list', () => {
      const setInfoFromList = jest.fn()
      const result = shouldUseCache({ cache: true, foo: 'bar' })(
        10,
        { list: [] },
        setInfoFromList,
      )
      expect(result).toBe(false)
    })
  })

  describe('when cache is false', () => {
    it('returns false', () => {
      const setInfoFromList = jest.fn()
      const result = shouldUseCache({ foo: 'bar' })(10, piece, setInfoFromList)
      expect(result).toBe(false)
    })
  })
})
