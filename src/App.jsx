import { useState } from "react"
import "./App.css"

function App() {
  const [flagKey, setFlagKey] = useState("")
  const [state, setState] = useState(false)
  const [type, setType ] = useState("boolean")
  const [variants, setVariants] = useState([
    { name: "true", value: true },
    { name: "false", value: false }
  ])

  const handleVariantChange = (index, key, value) => {
    const newVariants = variants.map((variant, i) => {
      if (i === index) {
        return { ...variant, [key]: value }
      }
      return variant
    })
    setVariants(newVariants)
  }

  const addVariant = () => {
    const newVariant = { name: "", value: "" }
    setVariants([...variants, newVariant])
  }

  const removeVariant = (index) => {
    const newVariants = variants.filter((_, i) => i !== index)
    setVariants(newVariants)
  }

  const generateJSON = () => {
    const json = {
      flagKey,
      state,
      type,
      variants,
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
          <br />
          <label htmlFor="type">Type</label>
          <select id="type" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="boolean">boolean</option>
            <option value="string">string</option>
            <option value="number">number</option>
            <option value="json">JSON</option>
          </select>
          <br />
          <label>Variants</label>
          <br />
          <div>
            {variants.map((variant, index) => (
              <div key={index}>
                <input placeholder="Name" value={variant.name} onChange={(e) => handleVariantChange(index, 'name', e.target.value)} />
                <input placeholder="Value" value={variant.value} onChange={(e) => handleVariantChange(index, 'value', e.target.value)} />
                <button id="remove" onClick={() => removeVariant(index)}>Remove</button>
              </div>
            ))}
            <button id="add" onClick={addVariant}>Add Variant</button>           
          </div>
        </div>
        <div>
          <textarea id="json" readOnly value={generateJSON()} rows={20} cols={50} />
        </div>
      </div>
    </>
  )
}

export default App