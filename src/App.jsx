import { useState } from "react"
import "./App.css"

function App() {
  const [flagKey, setFlagKey] = useState("")
  const [state, setState] = useState(false)

  const generateJSON = () => {
    const json = {
      flagKey,
      state,
    }
    return JSON.stringify(json, null, 2)
  }

  return (
    <>
      <h1>flagd ui</h1>
      <div className="container">
        <div>
          <label htmlFor="flagKey">FlagKey</label>
          <input id="flagKey" value={flagKey} onChange={(e) => setFlagKey(e.target.value)} />
          <br />
          <label htmlFor="state">State</label>
          <input id="state" type="checkbox" checked={state} onChange={(e) => setState(e.target.checked)} />
        </div>
        <div>
          <textarea readOnly value={generateJSON()} rows={20} cols={50} />
        </div>
      </div>
    </>
  )
}

export default App