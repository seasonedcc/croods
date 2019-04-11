import React, { useEffect } from 'react'
import { useFormState } from 'react-use-form-state'
import { navigate } from '@reach/router'
import useCroods from './useCroods'

const Info = ({ info, update, updating }) => {
  const [formState, { text }] = useFormState(info)
  return (
    <form onSubmit={async event => {
      event.preventDefault()
      await update(formState.values)
      navigate(`/${info.id}`)
    }}>
      <h2 style={{ color: info.color }}>{info.name}</h2>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: 200,
      }}>
        Name: <input {...text('name')} autoFocus />
        Color: <input {...text('color')} />
        {updating ? 'Loading...' : <button>Update</button>}
      </div>
    </form>
  )
}

export default ({ id }) => {
  const [
    { info, fetchingInfo, updating, updateError },
    { fetch, update },
  ] = useCroods({ name: 'colors' })
  useEffect(() => {
    fetch(id)
  }, [])
  return !info || fetchingInfo || updating ? (
    'Loading...'
  ) : updateError ? (
    <span>Could not update</span>
  ) : (
    <Info info={info} update={update(id)} updating={updating} />
  )
}
