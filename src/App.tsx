import { useState, ChangeEvent } from 'react'
import './App.css'

const flagDefinitionBase = {
  "$schema": "https://flagd.dev/schema/v0/flags.json",
  "flags": {}
}

function App() {
  const [flagKey, setFlagKey] = useState<string>('')
  const [state, setState] = useState<boolean>(false)

  const [flagDefinition, setFlagDefinition] = useState(flagDefinitionBase)

  const updateFlagKey = (event: ChangeEvent<HTMLInputElement>) => {
    setFlagKey(oldFlagKey => {
      const newFlagKey = event.target.value
      const definition = structuredClone(flagDefinition)
      const flags = definition['flags'] as any
      if (!oldFlagKey) {
        flags[newFlagKey] = {
          "state": state ? 'ENABLED' : 'DISABLED'
        }
      } else if (!newFlagKey) {
        delete flags[oldFlagKey]
      } else {
        flags[newFlagKey] = flags[oldFlagKey]
        delete flags[oldFlagKey]
      }
      setFlagDefinition(definition)
      return newFlagKey
    })
  }

  const updateState = () => {
    setState(oldState => {
      const newState = !oldState
      const definition = structuredClone(flagDefinition)
      const flags = definition['flags'] as any
      if (flagKey) {
        flags[flagKey] = {
          "state": newState ? 'ENABLED' : 'DISABLED'
        }
        setFlagDefinition(definition)
      }
      return newState
    })
  }

  return (
    <>
      <h1>flagd ui</h1>
      <div style={{display: 'flex', flexDirection: 'row', gap: '1%'}}>
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
        <div>
          <textarea
            rows={10}
            cols={50}
            readOnly
            value={JSON.stringify(flagDefinition)} />
        </div>
      </div>
    </>
  )
}

export default App
