export default function flagFormConverter(formData) {
    if (!formData.flagKey) return {}

    return {
        [formData.flagKey]: {
            state: formData.state ? "ENABLED" : "DISABLED",
            variants: formData.variants?.reduce((acc, v) => {
                if (formData.type === "object") {
                    try {
                        acc[v.name] = JSON.parse(v.value)
                    } catch (e) {
                        acc[v.name] = ""
                    }
                } else {
                    acc[v.name] = v.value
                }
                return acc
            }, {}),
            defaultVariant: formData.defaultVariant,
            targeting: formData.hasTargeting ? {
                if: [{
                    [formData.condition?.operator]: [{
                        var: formData.condition?.name
                    }, 
                    formData.condition?.operator === "in" ?
                        formData.condition?.value?.split(",").map(e => e.trim()) :
                        formData.condition?.value
                    ]
                },
                formData.targetVariant]
            } : {}
        }
    }
}