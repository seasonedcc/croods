const isDev = process.env.NODE_ENV === 'development'
const SUB_DIRECTORY =
  process.env.REACT_APP_SUB_DIRECTORY === undefined
    ? '/croods-light'
    : process.env.REACT_APP_SUB_DIRECTORY

export default (isDev ? '' : SUB_DIRECTORY)
