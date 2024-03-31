import { useState, ChangeEvent } from 'react'
import './App.css'

const flagDefinitionBase = {
  "$schema": "https://flagd.dev/schema/v0/flags.json",
  "flags": {
    "flagKey": ""
  }
}

function App() {
  const [flagKey, setFlagKey] = useState('')
  const [flagDefinition, setFlagDefinition] = useState(flagDefinitionBase)

  const handleFlagKeyChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFlagKey(event.target.value)
    const definition = JSON.parse(JSON.stringify(flagDefinitionBase))
    definition.flags.flagKey = event.target.value
    setFlagDefinition(definition)
  }

  return (
    <>
      <h1>flagd ui</h1>
      <div>
        <label>Flag Key</label>
        <input
          value={flagKey}
          onChange={handleFlagKeyChange}/>
      </div>
      <br/>
      <textarea
        rows={10}
        cols={50}
        value={JSON.stringify(flagDefinition)}/>
    </>
  )
}

export default App
