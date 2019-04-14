import React, { useEffect } from 'react'
import { Link } from '@reach/router'
import { useCroods } from 'croods-light'

export default ({ id }) => {
  const [{ info, fetchingInfo }, { fetch }] = useCroods({ name: 'colors' })
  useEffect(() => {
    fetch(id)()
    // eslint-disable-next-line
  }, [])
  return !info || fetchingInfo ? (
    'Loading...'
  ) : (
    <>
      <h1 style={{ color: info.color }}>{info.name}</h1>
      <h2>{info.color}</h2>
      <Link to="/">Back</Link>
    </>
  )
}
