import React from 'react'
import { useFormState } from 'react-use-form-state'
import { navigate } from '@reach/router'
import { useCroods } from 'croods-light'

export default () => {
  const [{ saving, saveError }, { save }] = useCroods({ name: 'colors' })
  const [formState, { text }] = useFormState()
  return (
    <form
      onSubmit={async event => {
        event.preventDefault()
        const ok = await save()(formState.values)
        ok && navigate('/')
      }}
    >
      <h2>New color</h2>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-around',
          alignItems: 'center',
          height: 200,
        }}
      >
        Name: <input {...text('name')} autoFocus />
        Color: <input {...text('color')} />
        {saveError && <span style={{ color: 'red' }}>{saveError}</span>}
        {saving ? 'Loading...' : <button>Update</button>}
      </div>
    </form>
  )
}
