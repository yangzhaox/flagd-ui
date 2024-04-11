export default function flagFormConverter(formData) {
    if (!formData.flagKey) return {}

    return {
        [formData.flagKey]: {
            state: formData.state ? "ENABLED" : "DISABLED",
            variants: formData.variants?.reduce((acc, v) => {
                acc[v.name] = v.value
                return acc
            }, {}),
            defaultVariant: formData.defaultVariant
        }
    }
}