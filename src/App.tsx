import { useState, ChangeEvent } from 'react'
import './App.css'

const flagDefinitionBase = {
  "$schema": "https://flagd.dev/schema/v0/flags.json",
  "flags": {}
}

function App() {
  const [flagKey, setFlagKey] = useState<string>('')
  const [flagState, setFlagState] = useState<boolean>(false)

  const [flagDefinition, setFlagDefinition] = useState(flagDefinitionBase)

  const updateFlagKey = (event: ChangeEvent<HTMLInputElement>) => {
    setFlagKey(oldFlagKey => {
      const newFlagKey = event.target.value
      const definition = JSON.parse(JSON.stringify(flagDefinition))
      if (!oldFlagKey) {
        definition['flags'][newFlagKey] = {
          "state": flagState ? 'ENABLED' : 'DISABLED'
        }
      } else if (!newFlagKey) {
        delete definition.flags[oldFlagKey]
      } else {
        definition['flags'][newFlagKey] = definition['flags'][oldFlagKey]
        delete definition.flags[oldFlagKey]
      }
      setFlagDefinition(definition)
      return newFlagKey
    })
  }

  const updateFlagState = () => {
    setFlagState(oldFlagState => {
      const newFlagState = !oldFlagState
      const definition = JSON.parse(JSON.stringify(flagDefinition))
      if (flagKey) {
        definition['flags'][flagKey] = {
          "state": newFlagState ? 'ENABLED' : 'DISABLED'
        }
        setFlagDefinition(definition)
      }
      return newFlagState
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
              checked={flagState}
              onChange={updateFlagState} />
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
