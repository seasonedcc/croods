import React from 'react'
import { Link } from '@reach/router'
import { Fetch, useCroods } from 'croods-light'
import api from './api'

export default ({ id }) => {
  const [{ info }] = useCroods({ ...api, id }, true)
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
      {info && <p>{info.name}</p>}
    </>
  )
}
