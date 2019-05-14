import shouldUseCache from '../shouldUseCache'

beforeEach(jest.clearAllMocks)

describe('shouldUseCache', () => {
  const piece = { list: ['foo', 'bar'] }
  it('should if we expect a list and there is a list when cache is true', () => {
    const setInfoFromList = jest.fn()
    const result = shouldUseCache({ cache: true })(null, piece, setInfoFromList)
    expect(result).toBe(true)
  })

  it('should if id is given and setInfoFromList grabs from the List', () => {
    const setInfoFromList = jest.fn(() => true)
    const result = shouldUseCache({ cache: true, foo: 'bar' })(
      10,
      piece,
      setInfoFromList,
    )
    expect(setInfoFromList).toHaveBeenCalledWith({ id: 10, foo: 'bar' })
    expect(result).toBe(true)
  })

  it('should not if setInfoFromList can not find the item', () => {
    const setInfoFromList = jest.fn(() => false)
    const result = shouldUseCache({ cache: true, foo: 'bar' })(
      10,
      piece,
      setInfoFromList,
    )
    expect(result).toBe(false)
  })

  it('should not if there is no items in list', () => {
    const setInfoFromList = jest.fn()
    const result = shouldUseCache({ foo: 'bar' })(
      10,
      { list: [] },
      setInfoFromList,
    )
    expect(result).toBe(false)
  })

  it('should not if cache was not set', () => {
    const setInfoFromList = jest.fn()
    const result = shouldUseCache({ foo: 'bar' })(10, piece, setInfoFromList)
    expect(result).toBe(false)
  })
})
