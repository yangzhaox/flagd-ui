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
                if: formData.rules.flatMap((rule) => [
                    rule.condition.operator === "sem_ver" ? {
                        [rule.condition.operator]: [
                            {
                                var: rule.condition.name
                            },
                            rule.condition.subOperator,
                            rule.condition.value
                        ]
                    } : {
                        [rule.condition.operator]: [
                            {
                                var: rule.condition.name
                            },
                            rule.condition.operator === "in" ?
                                rule.condition.value?.split(",").map(e => e.trim()) :
                                rule.condition.value
                        ]
                    },
                    rule.targetVariant
                ])
            } : {}
        }
    }
}