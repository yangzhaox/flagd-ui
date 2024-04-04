import FlagForm from "./FlagForm"
import FlagViewer from "./FlagViewer"
import { useForm, FormProvider } from "react-hook-form"
import "./App.css"

function App() {
  const methods = useForm()

  return (
    <>
      <h1>flagd ui</h1>
      <FormProvider {...methods}>
        <div className="container">
          <FlagForm />
          <FlagViewer />
        </div>
      </FormProvider>
    </>
  )
}

export default App