import React from 'react'
import { Link } from '@reach/router'
import { Fetch, useCroods } from 'croods-light'
import api from './api'

export default ({ id }) => {
  const [{ info, fetchingInfo }] = useCroods(
    { ...api, stateId: 'foo', id },
    true,
  )
  return (
    <>
      <Fetch
        id={id}
        name="colors"
        render={({ color, name }) => (
          <>
            <h1 style={{ color }}>{name}</h1>
            <h2>{color}</h2>
            <Link to="/">Back</Link>
          </>
        )}
      />
      <p>{info && !fetchingInfo ? info.name : 'Fetching user...'}</p>
    </>
  )
}
