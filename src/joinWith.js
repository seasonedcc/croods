import compact from 'lodash/compact'

export default (mark, ...args) => compact(args).join(mark)
