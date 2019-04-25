import * as pr from './persistHeaders'

export default ({
  persistHeaders,
  persistHeadersMethod,
  persistHeadersKey,
}) => response => {
  persistHeaders &&
    pr.saveHeaders(
      response,
      persistHeadersMethod || localStorage,
      persistHeadersKey,
    )
}
