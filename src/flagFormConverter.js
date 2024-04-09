export default function flagFormConverter(formData) {
    return {
        flagKey: formData.flagKey ? formData.flagKey : "",
        state: formData.state ? "ENABLED" : "DISABLED"
    }
}