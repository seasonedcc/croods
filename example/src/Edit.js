import React, { useEffect } from 'react'
import { useFormState } from 'react-use-form-state'
import { navigate } from '@reach/router'
import { useCroods } from 'croods-light'

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
        {saving ? 'Loading...' : <button>Update</button>}
      </div>
    </form>
  )
}

export default ({ id }) => {
  const [
    { info, fetchingInfo, saving, saveError },
    { fetch, save },
  ] = useCroods({ name: 'colors' })
  useEffect(() => {
    fetch(id)
  }, [fetch, id])
  return !info || fetchingInfo || saving ? (
    'Loading...'
  ) : saveError ? (
    <span>Could not save</span>
  ) : (
    <Info info={info} save={save(id)} saving={saving} />
  )
}
