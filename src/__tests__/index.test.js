import index from '..'

it('exports correctly', () => {
  const { useCroods,
    useStore,
    CroodsProvider,
    CroodsContext,
    Fetch, } = index

  expect(useCroods).toBeDefined()
  expect(useStore).toBeDefined()
  expect(CroodsProvider).toBeDefined()
  expect(CroodsContext).toBeDefined()
  expect(Fetch).toBeDefined()
})
