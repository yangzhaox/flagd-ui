import { useState, ChangeEvent } from 'react'

export default function FlagEditor(props: { flagDefinition: any, setFlagDefinition: any }) {
  const [flagKey, setFlagKey] = useState<string>('')
  const [state, setState] = useState<boolean>(false)

  const updateFlagKey = (event: ChangeEvent<HTMLInputElement>) => {
    setFlagKey(oldFlagKey => {
      const newFlagKey = event.target.value
      const definition = structuredClone(props.flagDefinition)
      if (!oldFlagKey) {
        definition[newFlagKey] = {
          "state": state ? 'ENABLED' : 'DISABLED'
        }
      } else if (!newFlagKey) {
        delete definition[oldFlagKey]
      } else {
        definition[newFlagKey] = definition[oldFlagKey]
        delete definition[oldFlagKey]
      }
      props.setFlagDefinition(definition)
      return newFlagKey
    })
  }

  const updateState = () => {
    setState(oldState => {
      const newState = !oldState
      const definition = structuredClone(props.flagDefinition)
      if (flagKey) {
        definition[flagKey] = {
          "state": newState ? 'ENABLED' : 'DISABLED'
        }
        props.setFlagDefinition(definition)
      }
      return newState
    })
  }

  return (
    <>
      <div>
        <div>
          <label htmlFor='flagKey'>Flag Key</label>
          <input
            id='flagKey'
            value={flagKey}
            onChange={updateFlagKey} />
        </div>
        <div>
          <label>State</label>
          <input
            type='checkbox'
            checked={state}
            onChange={updateState} />
        </div>
      </div>
    </>
  )
}