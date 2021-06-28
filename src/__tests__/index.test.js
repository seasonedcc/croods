import * as index from '..'

it('exports correctly', () => {
  expect(index.useCroods).toBeDefined()
  expect(index.useStore).toBeDefined()
  expect(index.CroodsProvider).toBeDefined()
  expect(index.useBaseOptions).toBeDefined()
  expect(index.useHydrate).toBeDefined()
  expect(index.Fetch).toBeDefined()
})
