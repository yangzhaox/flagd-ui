import { useState } from 'react'
import FlagEditor from './FlagEditor'
import FlagViewer from './FlagViewer'
import './App.css'

function App() {
  const [flagDefinition, setFlagDefinition] = useState({})

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
