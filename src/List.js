import React, { useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import useCroods from './useCroods'
import CroodsPropTypes from './CroodsPropTypes'

const Info = ({ render, renderError, renderLoading, id, name, ...props }) => {
  const [{ list, listError, fetchingList }, { fetch }] = useCroods({
    name,
    id,
    ...props,
  })
  const error = renderError || (({ message }) => <span>{message}</span>)
  const loading = renderLoading || (() => <span>Loading...</span>)
  const fetchList = useCallback(() => fetch(), [fetch])
  useEffect(() => {
    fetchList()
  }, [fetchList])
  useEffect(() => {
    fetch(id)
  }, [fetch, id])
  if (listError) return error(listError)
  return fetchingList ? loading() : render(list, { id, name, ...props })
}

Info.propTypes = {
  /** Ex: 1234 or '1234' */
  id: CroodsPropTypes.id.isRequired,
  /** Defines the deep properties used in the component. Ex: foo.bar */
  name: CroodsPropTypes.name.isRequired,
  /** A function returning a React Node. Ex: (list = {}, props) -> < JSX /> */
  render: PropTypes.func.isRequired,
  renderError: PropTypes.func,
  renderLoading: PropTypes.func,
}

export default Info
