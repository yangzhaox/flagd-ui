import { useState, ChangeEvent } from 'react'
import './App.css'

const flagDefinitionBase = {
  "$schema": "https://flagd.dev/schema/v0/flags.json",
  "flags": {}
}

function FlagEditor(props: { flagDefinition: any, setFlagDefinition: any }) {
  const [flagKey, setFlagKey] = useState<string>('')
  const [state, setState] = useState<boolean>(false)

  const updateFlagKey = (event: ChangeEvent<HTMLInputElement>) => {
    setFlagKey(oldFlagKey => {
      const newFlagKey = event.target.value
      const definition = structuredClone(props.flagDefinition)
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
      props.setFlagDefinition(definition)
      return newFlagKey
    })
  }

  const updateState = () => {
    setState(oldState => {
      const newState = !oldState
      const definition = structuredClone(props.flagDefinition)
      const flags = definition['flags'] as any
      if (flagKey) {
        flags[flagKey] = {
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

function FlagViewer(props: { flagDefinition: any }) {
  return (
    <>
      <textarea
        rows={10}
        cols={50}
        readOnly
        value={JSON.stringify(props.flagDefinition)} />
    </>
  )
}

function App() {
  const [flagDefinition, setFlagDefinition] = useState(flagDefinitionBase)

  return (
    <>
      <h1>flagd ui</h1>
      <div style={{ display: 'flex', flexDirection: 'row', gap: '1%' }}>
        <FlagEditor flagDefinition={flagDefinition} setFlagDefinition={setFlagDefinition} />
        <FlagViewer flagDefinition={flagDefinition} />
      </div>
    </>
  )
}

export default App
