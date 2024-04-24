import { useState } from "react"
import convertToFlagdFormat from "./convertToFlagdFormat"
import "./App.css"

const Rule = ({ index, variants, rule, handleRuleChange, removeRule }) => {

  const label = index === 0 ? "If" : "Else If"

  const semVerSubOperatorBlock = rule.condition.operator === "sem_ver" && (
    <select id={`subOperator${index}`}
      value={rule.condition.subOperator}
      onChange={(e) => handleRuleChange(index, "subOperator", e.target.value)}>
      <option value=">=">&gt;=</option>
      {/* Range specifiers: "=", "!=", ">", "<", ">=", "<=", "~" (match minor version), "^" (match major version). */}
      <option value="<=">&lt;=</option>
      <option value="~">~(minor)</option>
      <option value="^">^(major)</option>
      <option value="=">=</option>
      <option value="!=">!=</option>
      <option value=">">&gt;</option>
      <option value="<">&lt;</option>
    </select>
  )

  const variantOptionsBlock = variants.filter(variant => variant.name).map((variant, index) => (
    <option key={`targetVariant-${index}`} value={variant.name}>{variant.name}</option>
  ))

  return (
    <div>
      <label>{label}
        <input id={`condition${index}Name`} placeholder="Name"
          value={rule.condition.name}
          onChange={(e) => handleRuleChange(index, "name", e.target.value)} />
        <select id={`operator${index}`}
          value={rule.condition.operator}
          onChange={(e) => handleRuleChange(index, "operator", e.target.value)}>
          {/* String */}
          <option value="starts_with">Starts with</option>
          <option value="ends_with">Ends with</option>
          <option value="in_string">Contains in string</option>
          <option value="not_in_string">Not contains in string</option>
          <option value="sem_ver">Semantic version</option>
          {/* Array */}
          <option value="in_list">In a list</option>
          <option value="not_in_list">Not in a list</option>
          {/* Boolean */}
          <option value="==">Equals</option>
          <option value="===">Strict equals</option>
          <option value="!=">Not equals</option>
          <option value="!==">Not strict equals</option>
          <option value="!!">Exists</option>
          <option value="!">Not exists</option>
          {/* Numeric */}
          <option value=">">Greater than</option>
          <option value=">=">Greater than or equals</option>
          <option value="<">Less than</option>
          <option value="<=">Less than or equals</option>
        </select>
        {semVerSubOperatorBlock}
        <input id={`condition${index}Value`} placeholder="Value"
          value={rule.condition.value}
          onChange={(e) => handleRuleChange(index, "value", e.target.value)} />
      </label>
      <br />
      <label>Then
        <select id={`targetVariant${index}`}
          value={rule.targetVariant}
          onChange={(e) => handleRuleChange(index, "", e.target.value)}>
          {variantOptionsBlock}
        </select>
      </label>
      <button id={`removeRule${index}`} onClick={() => removeRule(index)}>Remove</button>
    </div>
  )
}

function App() {
  const [flagKey, setFlagKey] = useState("test-feature")
  const [state, setState] = useState(true)
  const [type, setType] = useState("boolean")
  const [variants, setVariants] = useState([
    { name: "true", value: true },
    { name: "false", value: false }
  ])
  const [defaultVariant, setDefaultVariant] = useState("false")

  const [hasTargeting, setHasTargeting] = useState(false)
  const [rules, setRules] = useState([{
    condition: { name: "", operator: "ends_with", subOperator: ">=", value: "" },
    targetVariant: "true"
  }])
  const [hasDefaultRule, setHasDefaultRule] = useState(false)
  const [defaultRule, setDefaultRule] = useState("false")

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

  const handleRuleChange = (index, key, value) => {
    const newRules = rules.map((rule, i) => {
      if (i === index) {
        if (key !== "") {
          return { condition: { ...rule.condition, [key]: value }, targetVariant: rule.targetVariant }
        } else {
          return { condition: rule.condition, targetVariant: value }
        }
      }
      return rule
    })
    setRules(newRules)
  }

  const addRule = () => {
    const newRule = {
      condition: { name: "", operator: "ends_with", subOperator: ">=", value: "" },
      targetVariant: "true"
    }
    setRules([...rules, newRule])
  }

  const removeRule = (index) => {
    const newRules = rules.filter((_, i) => i !== index)
    setRules(newRules)
  }

  const generateJSON = () => {
    const json = {
      flagKey,
      state,
      type,
      variants,
      defaultVariant,
      hasTargeting,
      rules,
      hasDefaultRule,
      defaultRule
    }
    const convertedJson = convertToFlagdFormat(json)
    return JSON.stringify(convertedJson, null, 2)
  }

  const getBooleanVariantBlock = (variant, index) => ( type === "boolean" ?
    <select id={`variant${index}Value`} value={variant.value.toString()}
      onChange={(e) => handleVariantChange(index, "value", e.target.value === "true")}>
      <option value="true">true</option>
      <option value="false">false</option>
    </select> : null )

  const getStringVariantBlock = (variant, index) => ( type === "string" ?
    <input id={`variant${index}Value`} placeholder="Value" value={variant.value}
      onChange={(e) => handleVariantChange(index, "value", e.target.value)} /> : null )

  const getNumberVariantBlock = (variant, index) => ( type === "number" ?
    <input id={`variant${index}Value`} type="number" value={variant.value}
      onChange={(e) => handleVariantChange(index, "value", Number(e.target.value))} /> : null )

  const getObjectVariantBlock = (variant, index) => ( type === "object" ?
    <input id={`variant${index}Value`} value={variant.value}
      onChange={(e) => handleVariantChange(index, "value", e.target.value)} /> : null )

  const variantsBlock = variants.map((variant, index) => (
    <div key={`variant${index}`}>
      <input id={`variant${index}Name`} placeholder="Name" value={variant.name}
        onChange={(e) => handleVariantChange(index, "name", e.target.value)} />
      {getBooleanVariantBlock(variant, index)}
      {getStringVariantBlock(variant, index)}
      {getNumberVariantBlock(variant, index)}
      {getObjectVariantBlock(variant, index)}
      <button id="removeVariant" onClick={() => removeVariant(index)}>Remove</button>
    </div>
  ))

  const variantOptionsBlock = variants.filter(variant => variant.name).map((variant, index) => (
    <option key={`variant-${index}`} value={variant.name}>{variant.name}</option>
  ))

  const rulesBlock = hasTargeting && rules.map((rule, index) => (
    <Rule key={index} index={index} variants={variants} rule={rule}
      handleRuleChange={handleRuleChange} removeRule={() => removeRule(index)} />
  ))

  const defaultRuleBlock = hasTargeting && hasDefaultRule && (
    <>
    <label>Else
      <select id="defaultRule"
        value={defaultRule}
        onChange={(e) => setDefaultRule(e.target.value)}>
        {variantOptionsBlock}
      </select>
    </label>
    <br/>
    </>
  )

  const addRuleButton = hasTargeting && (
    <button id="addRule" onClick={() => addRule()} >Add Rule</button>
  )

  const defaultRuleCheckbox = hasTargeting && (
    <>
      <input id="defaultRule" type="checkbox" checked={hasDefaultRule} 
        onClick={(e) => setHasDefaultRule(e.target.checked)} />
      <label htmlFor="defaultRule">Default Rule</label>
    </>
  )

  return (
    <>
      <h1>flagd ui</h1>
      <div className="container">
        <div className="left">
          <div>
            <label htmlFor="flagKey">Flag Key</label>
            <input id="flagKey" value={flagKey}
              onChange={(e) => setFlagKey(e.target.value)} />
          </div>
          <div>
            <label htmlFor="state">State</label>
            <input id="state" type="checkbox" checked={state}
              onChange={(e) => setState(e.target.checked)} />
          </div>
          <div>
            <label htmlFor="type">Type</label>
            <select id="type" value={type}
              onChange={(e) => handleTypeChange(e.target.value)}>
              <option value="boolean">boolean</option>
              <option value="string">string</option>
              <option value="number">number</option>
              <option value="object">object</option>
            </select>
          </div>
          <div>
            <label>Variants
              <div>
                {variantsBlock}
                <button id="addVariant" onClick={addVariant}>Add Variant</button>
              </div>
            </label>
          </div>
          <div>
            <label htmlFor="defaultVariant">Default Variant</label>
            <select id="defaultVariant"
              value={defaultVariant}
              onChange={(e) => setDefaultVariant(e.target.value)}>
              {variantOptionsBlock}
            </select>
          </div>
          <div>
            <label htmlFor="hasTargeting">Targeting</label>
            <input id="hasTargeting" type="checkbox" checked={hasTargeting}
              onChange={(e) => setHasTargeting(e.target.checked)} />
            <br />
            {rulesBlock}
            {defaultRuleBlock}
            {addRuleButton}
            {defaultRuleCheckbox}
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