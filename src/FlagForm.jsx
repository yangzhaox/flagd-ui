import { useFormContext } from "react-hook-form"

export default function FlagForm() {
    const { register } = useFormContext()

    return (
        <>
            <form>
                <label htmlFor="flagKey">Flag Key</label>
                <input id="flagKey" {...register("flagKey")} />
                <br />
                <label htmlFor="state">State</label>
                <select id="state" {...register("state")}>
                    <option value="DISABLED">Disabled</option>
                    <option value="ENABLED">Enabled</option>
                </select>
            </form>
        </>
    )
}