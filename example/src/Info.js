import React from 'react'
import { Link } from '@reach/router'
import { Fetch, useCroods } from 'croods-light'
import api from './api'
import basePath from './basePath'

export default ({ id }) => {
  const [{ info, fetchingInfo }] = useCroods({
    ...api,
    id,
    stateId: 'foo',
    fetchOnMount: true,
  })
  return (
    <>
      <Fetch
        id={id}
        name="colors"
        render={({ color, name }) => (
          <>
            <h1 style={{ color }}>{name}</h1>
            <h2>{color}</h2>
            <Link to={`${basePath}/`}>Back</Link>
          </>
        )}
      />
      <p>{info && !fetchingInfo ? info.name : 'Fetching user...'}</p>
    </>
  )
}
