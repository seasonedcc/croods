import React from 'react'
import { useFormState } from 'react-use-form-state'
import { navigate } from '@reach/router'
import { Fetch } from 'croods'
import basePath from './basePath'

const Edit = ({ info, save, saving }) => {
  const [formState, { text }] = useFormState(info)
  return (
    <form
      onSubmit={async event => {
        event.preventDefault()
        const saved = await save(formState.values)
        saved && navigate(`${basePath}/${saved.id}`)
      }}
    >
      <h2 style={{ color: info.color }}>{info.name}</h2>
      <div className="form">
        Name: <input {...text('name')} autoFocus />
        Color: <input {...text('color')} />
        Pantone Value: <input {...text('pantoneValue')} />
        {saving ? 'Loading...' : <button>Update</button>}
      </div>
    </form>
  )
}

export default ({ id }) => (
  <Fetch
    id={id}
    name="colors"
    render={(info, [{ saving }, { save }]) => (
      <Edit info={info} save={save({ id })} saving={saving} />
    )}
  />
)
