import compact from 'lodash/compact'

const joinWith = (mark: string, ...args: unknown[]): string =>
  compact(args).join(mark)

export { joinWith }
