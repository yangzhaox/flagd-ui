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
                if: formData.rules[0]?.condition?.operator === "sem_ver" ?
                    [{
                        [formData.rules[0]?.condition?.operator]: [{
                            var: formData.rules[0]?.condition?.name
                        },
                        formData.rules[0]?.condition?.subOperator,
                        formData.rules[0]?.condition?.value
                        ]
                    },
                    formData.rules[0]?.targetVariant] :
                    [{
                        [formData.rules[0]?.condition?.operator]: [{
                            var: formData.rules[0]?.condition?.name
                        },
                        formData.rules[0]?.condition?.operator === "in" ?
                            formData.rules[0]?.condition?.value?.split(",").map(e => e.trim()) :
                            formData.rules[0]?.condition?.value
                        ]
                    },
                    formData.rules[0]?.targetVariant]
            } : {}
        }
    }
}