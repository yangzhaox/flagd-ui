export default function FlagViewer(props: { flagDefinition: any }) {
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
