import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import CroodsPropTypes from './CroodsPropTypes'
import useCroods from './useCroods'

const Fetch = ({
  id,
  query,
  render,
  renderError,
  renderEmpty,
  renderLoading,
  ...options
}) => {
  const [state, actions] = useCroods({ ...options, id })
  const errorMessage = state.listError || state.infoError
  const result = id ? state.info : state.list

  useEffect(() => {
    actions.fetch({ id })(query)
    // eslint-disable-next-line
  }, [id])

  if (state.fetchingInfo || state.fetchingList) {
    const loading =
      renderLoading || options.renderLoading || (() => <div>Loading...</div>)
    return loading()
  }

  if (errorMessage) {
    const renderErrorMessage =
      renderError ||
      options.renderError ||
      (error => <div style={{ color: 'red' }}>{error}</div>)
    return renderErrorMessage(errorMessage)
  }

  if (id && !state.info) {
    return (renderEmpty || options.renderEmpty || (() => null))()
  }

  if (!id && !state.list.length && (renderEmpty || options.renderEmpty)) {
    return (renderEmpty || options.renderEmpty)()
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
