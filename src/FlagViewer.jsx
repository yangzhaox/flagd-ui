export default function FlagViewer({ flagDefinition }) {

  const definition = {
    "$schema": "https://flagd.dev/schema/v0/flags.json",
    "flags": {}
  }
  definition['flags'] = flagDefinition

  return (
    <>
      <textarea
        rows={10}
        cols={50}
        readOnly
        value={JSON.stringify(definition)} />
    </>
  )
}
