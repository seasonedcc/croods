import React from 'react'
import { useFormState } from 'react-use-form-state'
import { navigate } from '@reach/router'
import { useCroods } from 'croods'
import basePath from './basePath'

export default () => {
  const [{ saving, saveError }, { save }] = useCroods({ name: 'colors' })
  const [formState, { text }] = useFormState()
  return (
    <form
      onSubmit={async event => {
        event.preventDefault()
        const saved = await save({onProgress: progressEvent =>
          console.log('\n\n', progressEvent, '\n\n'),
})({

          ...formState.values,
        })
        saved && navigate(`${basePath}/${saved.id}`)
      }}
    >
      <h2>New color</h2>
      <div className="form">
        Name: <input {...text('name')} autoFocus />
        Color: <input {...text('color')} />
        {saveError && <span style={{ color: 'red' }}>{saveError}</span>}
        {saving ? 'Loading...' : <button>Update</button>}
      </div>
    </form>
  )
}
