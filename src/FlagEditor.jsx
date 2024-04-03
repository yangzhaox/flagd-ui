import { useState } from 'react'

export default function FlagEditor({ flagDefinition, setFlagDefinition }) {
  const [flagKey, setFlagKey] = useState('')
  const [state, setState] = useState(false)

  const updateFlagKey = (event) => {
    setFlagKey(oldFlagKey => {
      const newFlagKey = event.target.value
      const definition = structuredClone(flagDefinition)
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
      setFlagDefinition(definition)
      return newFlagKey
    })
  }

  const updateState = () => {
    setState(oldState => {
      const newState = !oldState
      const definition = structuredClone(flagDefinition)
      if (flagKey) {
        definition[flagKey] = {
          "state": newState ? 'ENABLED' : 'DISABLED'
        }
        setFlagDefinition(definition)
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