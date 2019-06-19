import React, { useEffect, useContext } from 'react'
import PropTypes from 'prop-types'
import get from 'lodash/get'
import CroodsPropTypes from './CroodsPropTypes'
import useCroods from './useCroods'
import Context from './Context'
import { FetchOptions } from './typeDeclarations'

const Fetch = ({
  id,
  query,
  render,
  renderError,
  renderEmpty,
  renderLoading,
  ...options
}: FetchOptions) => {
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

  if (id && !state.info) {
    return (renderEmpty || get(baseOptions, 'renderEmpty') || (() => null))()
  }

  if (
    !id &&
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
