import React from 'react'
import { useFormState } from 'react-use-form-state'
import { navigate } from '@reach/router'
import { Fetch } from 'croods-light'

const Info = ({ info, save, saving }) => {
  const [formState, { text }] = useFormState(info)
  return (
    <form
      onSubmit={async event => {
        event.preventDefault()
        const submitted = await save(formState.values)
        submitted && navigate(`/${info.id}`)
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
      <Info info={info} save={save(id)} saving={saving} />
    )}
  />
)
