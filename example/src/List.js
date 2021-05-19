import React from 'react'
import { Fetch } from 'croods'
import { Link } from '@reach/router'
import tinyColor from 'tinycolor2'
import api from './api'
import basePath from './basePath'

const List = () => (
  <div>
    <h1>Croods Light</h1>
    <Fetch
      name="colors"
      renderEmpty={() => 'No results...'}
      render={(list, [, actions]) =>
        list.map(item => <Color key={item.id} actions={actions} {...item} />)
      }
    />
    <p>
      <Link to={`${basePath}/new`}>New</Link>
    </p>
    <Fetch
      {...api}
      query={{ page: 2, foo: undefined, camelCase: 'should-be-kebab' }}
      renderLoading={() => 'Fetching users...'}
      render={list => (
        <ul style={{ textAlign: 'left' }}>
          {list.map(li => (
            <li key={li.id}>
              <Link to={`${basePath}/${li.id}`}>User: {li.name}</Link>
            </li>
          ))}
        </ul>
      )}
    />
  </div>
)

const Color = ({ actions, ...props }) => {
  const { name, color, id } = props
  const { destroying, destroyError, saving, saveError } = props
  const error = destroyError || saveError

  const lightColor = tinyColor(color).lighten().toHexString()
  const darkColor = tinyColor(color).darken().toHexString()
  const updating =
    (saving && 'Updating...') || (destroying && 'Deleting...') || error
  const onClick = (action, data) => event => {
    event.preventDefault()
    action(data)
  }
  return (
    <div>
      <h2 style={{ display: 'inline-block' }}>
        <Link to={`${basePath}/${id}`} style={{ color }}>
          {name}
        </Link>
      </h2>{' '}
      {updating ? (
        <span style={{ color: error ? 'red' : undefined }}>{updating}</span>
      ) : (
        <>
          <Link to={`${basePath}/${id}/edit`}>Edit</Link>
          {' | '}
          <a href="#action" onClick={onClick(actions.destroy({ id }))}>
            Delete
          </a>
          {' | '}
          <a
            href="#action"
            onClick={onClick(actions.save({ id }), { color: lightColor })}
          >
            Lighten
          </a>
          {' | '}
          <a
            href="#action"
            onClick={onClick(actions.save({ id }), { color: darkColor })}
          >
            Darken
          </a>
        </>
      )}
    </div>
  )
}

export default List
