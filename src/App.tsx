import { useState } from 'react'
import FlagEditor from './FlagEditor'
import './App.css'

const flagDefinitionBase = {
  "$schema": "https://flagd.dev/schema/v0/flags.json",
  "flags": {}
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
