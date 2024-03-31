import { useState, ChangeEvent } from 'react'
import './App.css'

const flagDefinitionBase = {
  "$schema": "https://flagd.dev/schema/v0/flags.json",
  "flags": {}
}

function App() {
  const [flagKey, setFlagKey] = useState<string>('')
  const [flagDefinition, setFlagDefinition] = useState(flagDefinitionBase)

  const updateFlagKey = (event: ChangeEvent<HTMLInputElement>) => {
    setFlagKey(oldFlagKey => {
      const definition = JSON.parse(JSON.stringify(flagDefinition))
      const newFlagKey = event.target.value
      if (!oldFlagKey) {
        definition['flags'][newFlagKey] = {}
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

  return (
    <>
      <h1>flagd ui</h1>
      <div>
        <label>Flag Key</label>
        <input
          value={flagKey}
          onChange={updateFlagKey}/>
      </div>
      <br/>
      <textarea
        rows={10}
        cols={50}
        readOnly
        value={JSON.stringify(flagDefinition)}/>
    </>
  )
}

export default App
