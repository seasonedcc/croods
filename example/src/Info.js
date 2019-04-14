import React from 'react'
import { Link } from '@reach/router'
import { Fetch } from 'croods-light'

export default ({ id }) => (
  <Fetch
    id={id}
    name="colors"
    render={info => (
      <>
        <h1 style={{ color: info.color }}>{info.name}</h1>
        <h2>{info.color}</h2>
        <Link to="/">Back</Link>
      </>
    )}
  />
)
