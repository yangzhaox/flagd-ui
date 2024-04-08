import { useFormContext } from "react-hook-form"

export default function FlagViewer() {
  const { watch } = useFormContext()

  return (
    <>
      <textarea
        id="viewer"
        rows={10}
        cols={50}
        readOnly
        value={JSON.stringify(watch())} />
    </>
  )
}
