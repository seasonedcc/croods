import React from 'react'
import { useFormState } from 'react-use-form-state'
import { navigate } from '@reach/router'
import useCroods from './useCroods'

export default ({ id }) => {
  const [{ creating }, { create }] = useCroods({ name: 'colors' })
  const [formState, { text }] = useFormState()
  return (
    <form onSubmit={async event => {
      event.preventDefault()
      await create(formState.values)
      navigate('/')
    }}>
      <h2>New color</h2>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: 200,
      }}>
        Name: <input {...text('name')} autoFocus />
        Color: <input {...text('color')} />
        {creating ? 'Loading...' : <button>Update</button>}
      </div>
    </form>
  )
}
