import React, { useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import useCroods from './useCroods'
import CroodsPropTypes from './CroodsPropTypes'

const Info = ({ render, renderError, renderLoading, id, name, ...props }) => {
  const [{ info, infoError, fetchingInfo }, { fetch }] = useCroods({
    name,
    id,
    ...props,
  })
  const error = renderError || (({ message }) => <span>{message}</span>)
  const loading = renderLoading || (() => <span>Loading...</span>)
  const fetchInfo = useCallback(() => fetch(id), [fetch, id])
  useEffect(() => {
    fetchInfo()
  }, [fetchInfo])
  if (infoError) return error(infoError)
  return fetchingInfo ? loading() : render(info, { id, name, ...props })
}

Info.propTypes = {
  /** Ex: 1234 or '1234' */
  id: CroodsPropTypes.id.isRequired,
  /** Defines the deep properties used in the component. Ex: foo.bar */
  name: CroodsPropTypes.name.isRequired,
  /** A function returning a React Node. Ex: (info = {}, props) -> < JSX /> */
  render: PropTypes.func.isRequired,
  renderError: PropTypes.func,
  renderLoading: PropTypes.func,
}

export default Info
