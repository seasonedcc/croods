import React from 'react'
import { Link, RouteComponentProps } from '@reach/router'
import { Fetch, useCroods } from 'croods'
import api from './api'
import basePath from './basePath'
import { Color, User } from './App'

type Props = RouteComponentProps & { id?: string }
const Info: React.FC<Props> = ({ id }) => {
  const [{ info, fetchingInfo }] = useCroods<User>({
    ...api,
    id,
    stateId: 'foo',
    fetchOnMount: true,
  })
  return (
    <>
      <Fetch<Color>
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

export default Info
