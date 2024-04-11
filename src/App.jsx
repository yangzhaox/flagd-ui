import { useState } from "react"
import "./App.css"

function App() {
  const [flagKey, setFlagKey] = useState("")

  const generateJSON = () => {
    const json = {
      flagKey,
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
        </div>
        <div>
          <textarea readOnly value={generateJSON()} rows={20} />
        </div>
      </div>
    </>
  )
}

export default App