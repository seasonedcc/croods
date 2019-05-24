import React, { useEffect, useContext } from 'react'
import PropTypes from 'prop-types'
import CroodsPropTypes from './CroodsPropTypes'
import useCroods from './useCroods'
import Context from './Context'

const Fetch = ({
  id,
  query,
  render,
  renderError,
  renderEmpty,
  renderLoading,
  ...options
}) => {
  // baseOptions -> config from provider
  const baseOptions = useContext(Context)
  const [state, actions] = useCroods({ ...options, id })
  const errorMessage = state.listError || state.infoError
  const result = id ? state.info : state.list

  useEffect(() => {
    actions.fetch({ id })(query)
    // eslint-disable-next-line
  }, [id])

  if (state.fetchingInfo || state.fetchingList) {
    const loading =
      renderLoading ||
      baseOptions.renderLoading ||
      (() => <div>Loading...</div>)
    return loading()
  }

  if (errorMessage) {
    const renderErrorMessage =
      renderError ||
      baseOptions.renderError ||
      (error => <div style={{ color: 'red' }}>{error}</div>)
    return renderErrorMessage(errorMessage)
  }

  if (id && !state.info) {
    return (renderEmpty || baseOptions.renderEmpty || (() => null))()
  }

  if (!id && !state.list.length && (renderEmpty || baseOptions.renderEmpty)) {
    return (renderEmpty || baseOptions.renderEmpty)()
  }

  return render(result, [state, actions])
}

Fetch.propTypes = {
  id: CroodsPropTypes.id,
  name: CroodsPropTypes.name.isRequired,
  stateId: PropTypes.string,
  query: PropTypes.object,
  render: PropTypes.func.isRequired,
  renderError: PropTypes.func,
  renderEmpty: PropTypes.func,
  renderLoading: PropTypes.func,
}

export default Fetch
