import React from 'react'
import { useFormState } from 'react-use-form-state'
import { navigate, RouteComponentProps } from '@reach/router'
import { Fetch } from 'croods'
import basePath from './basePath'
import { Color } from './App'

type EditProps = {
  info: Color
  save(t?: Record<string, any>): Promise<Color>
  setInfo(t?: Record<string, any>, b?: boolean): void
  saving?: boolean
}
const Edit: React.FC<EditProps> = ({ info, save, saving, setInfo }) => {
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
        {saving ? (
          'Loading...'
        ) : (
          <div style={{ display: 'grid', gridAutoFlow: 'column', gap: 3 }}>
            <button type="submit">Update</button>
            <button
              onClick={event => {
                event.preventDefault()
                setInfo(formState.values, true)
              }}
            >
              Local Update (setInfo)
            </button>
          </div>
        )}
      </div>
    </form>
  )
}

type Props = RouteComponentProps & { id?: string }
const EditPage: React.FC<Props> = ({ id }) => (
  <Fetch
    id={id}
    name="colors"
    render={(info, [{ saving }, { save, setInfo }]) => (
      <Edit info={info} save={save({ id })} setInfo={setInfo} saving={saving} />
    )}
  />
)

export default EditPage
