import compact from 'lodash/compact'

const joinWith = (separator: string, ...args: unknown[]): string =>
  compact(args).join(separator)

export { joinWith }
