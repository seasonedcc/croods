import { useEffect, useContext } from 'react'
import PropTypes from 'prop-types'
import get from 'lodash/get'
import CroodsPropTypes from './CroodsPropTypes'
import useCroods from './useCroods'
import Context from './Context'
import { FetchOptions } from './typeDeclarations'

const Fetch = ({
  id,
  query,
  path,
  stateId,
  render,
  renderError,
  renderEmpty,
  renderLoading,
  ...options
}: FetchOptions): React.ReactNode => {
  // baseOptions -> config from provider
  const baseOptions = useContext(Context)
  const [state, actions] = useCroods({ ...options, id, path, stateId })
  const errorMessage = state.listError || state.infoError
  const isList = !id
  const result = isList ? state.list : state.info

  useEffect(() => {
    actions.fetch({ id })(query)
    // eslint-disable-next-line
  }, [id, query, path, stateId])

  if (isList ? state.fetchingList : state.fetchingInfo) {
    const loading =
      renderLoading ||
      get(baseOptions, 'renderLoading') ||
      (() => <div>Loading...</div>)
    return loading()
  }

  if (errorMessage) {
    const renderErrorMessage =
      renderError ||
      get(baseOptions, 'renderError') ||
      ((error: string) => <div style={{ color: 'red' }}>{error}</div>)
    return renderErrorMessage(errorMessage)
  }

  if (!isList && !state.info) {
    return (renderEmpty || get(baseOptions, 'renderEmpty') || (() => null))()
  }

  if (
    isList &&
    (!state.list || !state.list.length) &&
    (renderEmpty || get(baseOptions, 'renderEmpty'))
  ) {
    return (renderEmpty || get(baseOptions, 'renderEmpty'))()
  }

  return render(result, [state, actions])
}

Fetch.propTypes = {
  id: CroodsPropTypes.id,
  // @ts-ignore
  name: CroodsPropTypes.name.isRequired,
  stateId: PropTypes.string,
  query: PropTypes.object,
  render: PropTypes.func.isRequired,
  renderError: PropTypes.func,
  renderEmpty: PropTypes.func,
  renderLoading: PropTypes.func,
}

export default Fetch
