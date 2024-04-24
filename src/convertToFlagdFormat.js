export default function flagFormConverter(formData) {
    if (!formData.flagKey) return {}

    const state = formData.state ? "ENABLED" : "DISABLED"

    const variants = formData.variants?.reduce((acc, v) => {
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
    }, {})

    const defaultVariant = formData.defaultVariant

    const getSemVerCondition = (condition) => {
        return {
            [condition.operator]: [
                {
                    var: condition.name
                },
                condition.subOperator,
                condition.value
            ]
        }
    }

    const getCondition = (condition) => {
        const operator = condition.operator === "not_in" || 
                         condition.operator === "in_string" ||
                         condition.operator === "not_in_string" ? 
                         "in" : condition.operator
        const rule = {
            [operator]: [
                {
                    var: condition.name
                }, 
                condition.operator === "in" ||
                condition.operator === "not_in" ?
                    commaSeparatedStringtoArray(condition.value) :
                    condition.value
            ]
        }
        return condition.operator === "not_in" || 
               condition.operator === "not_in_string" ? { "!": rule } : rule
    }

    const commaSeparatedStringtoArray = (csv) => csv?.split(",").map(e => e.trim())

    const ifArray = formData.rules?.flatMap((rule) => [
        rule.condition.operator === "sem_ver" ?
            getSemVerCondition(rule.condition) :
            getCondition(rule.condition),
        rule.targetVariant
    ])

    if (formData.hasDefaultRule) {
        ifArray.push(formData.defaultRule)
    }

    const targeting = formData.hasTargeting ? { if: ifArray } : {}

    return {
        [formData.flagKey]: {
            state,
            variants,
            defaultVariant,
            targeting
        }
    }
}