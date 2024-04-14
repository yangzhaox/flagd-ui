import { useState } from "react"
import "./App.css"
import flagFormConverter from "./flagFormConverter"

function App() {
  const [flagKey, setFlagKey] = useState("test-feature")
  const [state, setState] = useState(false)
  const [type, setType] = useState("boolean")
  const [variants, setVariants] = useState([
    { name: "true", value: true },
    { name: "false", value: false }
  ])
  const [defaultVariant, setDefaultVariant] = useState("false")

  const handleTypeChange = (newType) => {
    setType(newType)
    if (newType === "boolean") {
      setVariants([
        { name: "true", value: true },
        { name: "false", value: false }
      ])
      setDefaultVariant("false")
    } else if (newType === "string") {
      setVariants([
        { name: "foo", value: "foo"},
        { name: "bar", value: "bar"}
      ])
      setDefaultVariant("foo")
    } else if (newType === "number") {
      setVariants([
        { name: "1", value: 1},
        { name: "2", value: 2}
      ])
      setDefaultVariant("1")
    } else if (newType === "object") {
      setVariants([
        { name: "foo", value: { foo: "foo" }},
        { name: "bar", value: { bar: "bar" }}
      ])
      setDefaultVariant("foo")
    }
  }

  const handleVariantChange = (index, key, value) => {
    const newVariants = variants.map((variant, i) => {
      if (i === index) {
        return { ...variant, [key]: value }
      }
      return variant
    })
    setVariants(newVariants)
    newVariants.length === 1 ? setDefaultVariant(newVariants[0].name) : null
  }

  const addVariant = () => {
    const newVariant = { name: "" }
    if (type === "boolean") {
      newVariant.value = false
    } else if (type === "string") {
      newVariant.value = ""
    } else if (type === "number") {
      newVariant.value = 0
    } else if (type === "object") {
      newVariant.value = {}
    }
    setVariants([...variants, newVariant])
  }

  const removeVariant = (index) => {
    const newVariants = variants.filter((_, i) => i !== index)
    setVariants(newVariants)
    if (defaultVariant === variants[index].name) {
      setDefaultVariant(newVariants[0]?.name || "");
    }
  }

  const generateJSON = () => {
    const json = {
      flagKey,
      state,
      type,
      variants,
      defaultVariant,
    }
    const convertedJson = flagFormConverter(json)
    return JSON.stringify(convertedJson, null, 2)
  }

  return (
    <>
      <h1>flagd ui</h1>
      <div className="container">
        <div className="left">
          <div>
            <label htmlFor="flagKey">Flag Key</label>
            <input id="flagKey" value={flagKey} onChange={(e) => setFlagKey(e.target.value)} />
          </div>
          <div>
            <label htmlFor="state">State</label>
            <input id="state" type="checkbox" checked={state} onChange={(e) => setState(e.target.checked)} />
          </div>
          <div>
            <label htmlFor="type">Type</label>
            <select id="type" value={type} onChange={(e) => handleTypeChange(e.target.value)}>
              <option value="boolean">boolean</option>
              <option value="string">string</option>
              <option value="number">number</option>
              <option value="object">object</option>
            </select>
          </div>
          <div>
            <label>Variants
              <div>
                {variants.map((variant, index) => (
                  <div key={`variant${index}`}>
                    <input id={`variant${index}Name`} placeholder="Name" value={variant.name}
                      onChange={(e) => handleVariantChange(index, "name", e.target.value)} />
                    {type === "boolean" ?
                      <select id={`variant${index}Value`} value={variant.value.toString()} 
                        onChange={(e) => handleVariantChange(index, "value", e.target.value === "true")}>
                        <option value="true">true</option>
                        <option value="false">false</option>
                      </select> : null}
                    {type === "string" ?
                      <input id={`variant${index}Value`} placeholder="Value" value={variant.value} 
                        onChange={(e) => handleVariantChange(index, "value", e.target.value)}/> : null}
                    {type === "number" ?
                      <input id={`variant${index}Value`} type="number" value={variant.value} 
                        onChange={(e) => handleVariantChange(index, "value", Number(e.target.value))}/> : null}
                    {type === "object" ?
                      <input id={`variant${index}Value`} value={JSON.stringify(variant.value)} 
                        onChange={(e) => handleVariantChange(index, "value", JSON.parse(e.target.value))}/> : null}
                    <button id="removeVariant" onClick={() => removeVariant(index)}>Remove</button>
                  </div>
                ))}
                <button id="addVariant" onClick={addVariant}>Add Variant</button>
              </div>
            </label>
          </div>
          <div>
            <label htmlFor="defaultVariant">Default Variant</label>
            <select id="defaultVariant" value={defaultVariant} onChange={(e) => setDefaultVariant(e.target.value)}>
              {variants.filter(variant => variant.name).map((variant, index) => (
                <option key={`variant-${index}`} value={variant.name}>{variant.name}</option>
              ))}
            </select>
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