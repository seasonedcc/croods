import React from 'react'
import { Link, RouteComponentProps } from '@reach/router'
import { Fetch, useCroods } from 'croods'
import api from './api'
import basePath from './basePath'

type Props = RouteComponentProps & { id?: string }
export default ({ id }: Props): JSX.Element => {
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
        query={{ page: 2, foo: [1, 2] }}
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
