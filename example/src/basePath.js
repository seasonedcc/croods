const isDev = process.env.NODE_ENV === 'development'
const SUB_DIRECTORY =
  process.env.SUB_DIRECTORY === undefined
    ? '/croods-light'
    : process.env.SUB_DIRECTORY

export default (isDev ? '' : SUB_DIRECTORY)
