import compact from 'lodash/compact'

export default (mark: string, ...args: unknown[]): string =>
  compact(args).join(mark)
