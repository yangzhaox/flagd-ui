import { useFormContext } from "react-hook-form"
import flagFormConverter from "./flagFormConverter"

export default function FlagViewer() {
  const { watch } = useFormContext()

  const formData = watch()

  const convertedFormData = flagFormConverter(formData)

  return (
    <>
      <textarea
        id="viewer"
        rows={10}
        cols={50}
        readOnly
        value={JSON.stringify(convertedFormData)} />
    </>
  )
}
