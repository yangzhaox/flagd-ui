import { useState } from "react"
import "./App.css"
import flagFormConverter from "./flagFormConverter"

const IfConditionThen = ({ condition, setCondition, variants, targetVariant, setTargetVariant }) => {
  return (
    <div>
      <label>If
        <input id="conditionName" placeholder="Name"
          value={condition.name}
          onChange={(e) => setCondition({ ...condition, name: e.target.value })} />
        <select id="operator"
          value={condition.operator}
          onChange={(e) => setCondition({
            ...condition,
            operator: e.target.value,
            subOperator: e.target.value === "sem_ver" ? ">=" : ""
          })}>
          <option value="ends_with">ends with</option>
          <option value="in">in</option>
          <option value="sem_ver">semantic version</option>
        </select>
        {condition.operator === "sem_ver" && (
          <select id="subOperator"
            value={condition.subOperator}
            onChange={(e) => setCondition({ ...condition, subOperator: e.target.value })}>
            <option value=">=">&gt;=</option>
          </select>)}
        <input id="conditionValue" placeholder="Value"
          value={condition.value}
          onChange={(e) => setCondition({ ...condition, value: e.target.value })} />
      </label>
      <br />
      <label>Then
        <select id="targetVariant"
          value={targetVariant}
          onChange={(e) => setTargetVariant(e.target.value)}>
          {variants.filter(variant => variant.name).map((variant, index) => (
            <option key={`targetVariant-${index}`} value={variant.name}>{variant.name}</option>
          ))}
        </select>
      </label>
    </div>
  )
}

function App() {
  const [flagKey, setFlagKey] = useState("test-feature")
  const [state, setState] = useState(false)
  const [type, setType] = useState("boolean")
  const [variants, setVariants] = useState([
    { name: "true", value: true },
    { name: "false", value: false }
  ])
  const [defaultVariant, setDefaultVariant] = useState("false")
  
  const [hasTargeting, setHasTargeting] = useState(false)
  const [condition, setCondition] = useState({
    name: "", operator: "ends_with", value: ""
  })  
  const [targetVariant, setTargetVariant] = useState("true")

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
        { name: "foo", value: "foo" },
        { name: "bar", value: "bar" }
      ])
      setDefaultVariant("foo")
    } else if (newType === "number") {
      setVariants([
        { name: "1", value: 1 },
        { name: "2", value: 2 }
      ])
      setDefaultVariant("1")
    } else if (newType === "object") {
      setVariants([
        { name: "foo", value: JSON.stringify({ foo: "foo" }) },
        { name: "bar", value: JSON.stringify({ bar: "bar" }) }
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
      newVariant.value = JSON.stringify({})
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
      hasTargeting,
      condition,
      targetVariant
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
                        onChange={(e) => handleVariantChange(index, "value", e.target.value)} /> : null}
                    {type === "number" ?
                      <input id={`variant${index}Value`} type="number" value={variant.value}
                        onChange={(e) => handleVariantChange(index, "value", Number(e.target.value))} /> : null}
                    {type === "object" ?
                      <input id={`variant${index}Value`} value={variant.value}
                        onChange={(e) => handleVariantChange(index, "value", e.target.value)} /> : null}
                    <button id="removeVariant" onClick={() => removeVariant(index)}>Remove</button>
                  </div>
                ))}
                <button id="addVariant" onClick={addVariant}>Add Variant</button>
              </div>
            </label>
          </div>
          <div>
            <label htmlFor="defaultVariant">Default Variant</label>
            <select id="defaultVariant"
              value={defaultVariant}
              onChange={(e) => setDefaultVariant(e.target.value)}>
              {variants.filter(variant => variant.name).map((variant, index) => (
                <option key={`variant-${index}`} value={variant.name}>{variant.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="hasTargeting">Targeting</label>
            <input id="hasTargeting" type="checkbox" checked={hasTargeting} onChange={(e) => setHasTargeting(e.target.checked)} />
            <br />
            {hasTargeting && (
              <IfConditionThen condition={condition} setCondition={setCondition} 
                variants={variants} targetVariant={targetVariant} setTargetVariant={setTargetVariant} />)}
          </div>
        </div>
        <div>
          <textarea id="json" readOnly value={generateJSON()} rows={30} cols={50} />
        </div>
      </div>
    </>
  )
}

export default App