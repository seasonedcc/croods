import React, { useState } from 'react'
import tinyColor from 'tinycolor2'
import { Link } from '@reach/router'
import './App.css'

const ActionLink = ({ action, data, children, callback }) => (
  <a
    href={`#action`}
    onClick={event => {
      event.preventDefault()
      action(data)
      callback && callback()
    }}
  >
    {children}
  </a>
)

const Color = ({ actions, ...props }) => {
  const { name, color, id } = props
  const { destroying, destroyError, updating, updateError } = props
  const error = destroyError || updateError
  const lightColor = tinyColor(color)
    .lighten()
    .toHexString()
  const darkColor = tinyColor(color)
    .darken()
    .toHexString()
  return (
    <div>
      <h2 style={{ display: 'inline-block' }}>
        <Link to={`/${id}`} style={{ color }}>
          {name}
        </Link>
      </h2>{' '}
      {updating ? (
        <span>Updating...</span>
      ) : destroying ? (
        <span>Deleting...</span>
      ) : error ? (
        <span style={{ color: 'red' }}>{error}</span>
      ) : (
        <>
          <Link to={`/${id}/edit`}>Edit</Link>
          {' | '}
          <ActionLink action={actions.destroy(id)} data={{}}>
            Delete
          </ActionLink>
          {' | '}
          <ActionLink action={actions.update(id)} data={{ color: lightColor }}>
            Lighten
          </ActionLink>
          {' | '}
          <ActionLink action={actions.update(id)} data={{ color: darkColor }}>
            Darken
          </ActionLink>
        </>
      )}
    </div>
  )
}

const List = ({ list, listError, fetchingList, actions }) => {
  const [clicked, setClicked] = useState(false)
  return (
    <>
    <h1>Colors</h1>
      {clicked || (
        <ActionLink
          action={actions.create}
          data={{ color: 'green', name: 'green', $_addToTop: true }}
          callback={() => setClicked(true)}
        >
          Create Green on Top
        </ActionLink>
      )}
      {list.length ? (
        list.map(item => <Color key={item.id} actions={actions} {...item} />)
      ) : listError ? (
        <span>Error: {listError}</span>
      ) : fetchingList ? (
        <span>Loading...</span>
      ) : (
        <span>Empty</span>
      )}
      <Link to="/new">New</Link>
    </>
  )
}

export default List
