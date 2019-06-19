import compact from 'lodash/compact'

export default (mark: string, ...args: any) => compact(args).join(mark)
