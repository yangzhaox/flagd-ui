import { describe, it, xit, expect } from 'vitest'
import flagFormConverter from "./flagFormConverter"

describe("flagFormConverter", () => {
    const testFlagKey = "test-feature"

    it("should return empty object if flagKey is empty", () => {
        const actual = flagFormConverter({ flagKey: "" })
        expect(actual).toStrictEqual({})
    })

    it("should return flagKey in object if flagKey is not empty", () => {
        const actual = flagFormConverter({ flagKey: testFlagKey })
        expect(actual).toHaveProperty(testFlagKey)
    })

    it("should convert state from true to ENABLED", () => {
        const actual = flagFormConverter({ flagKey: testFlagKey, state: true })
        expect(actual[testFlagKey].state).toBe("ENABLED")
    })

    it("should convert state from false to DISABLED", () => {
        const actual = flagFormConverter({ flagKey: testFlagKey, state: false })
        expect(actual[testFlagKey].state).toBe("DISABLED")
    })

    it("should return variants as empty object", () => {
        const actual = flagFormConverter({ flagKey: testFlagKey, variants: [] })
        expect(actual[testFlagKey].variants).toStrictEqual({})
    })

    it("should return 1 variant", () => {
        const actual = flagFormConverter({
            flagKey: testFlagKey,
            variants: [{ name: "true", value: true }]
        })
        expect(actual[testFlagKey].variants).toStrictEqual({ true: true })
    })

    it("should return 2 variants", () => {
        const actual = flagFormConverter({
            flagKey: testFlagKey,
            variants: [{ name: "true", value: true }, { name: "false", value: false }]
        })
        expect(actual[testFlagKey].variants).toStrictEqual({ true: true, false: false })
    })

    it("should return json object if variant value is valid json", () => {
        const actual = flagFormConverter({
            flagKey: testFlagKey, type: "object",
            variants: [{ name: "foo", value: "{}" }]
        })
        expect(actual[testFlagKey].variants["foo"]).toStrictEqual({})
    })

    it("should return empty string if variant value is not valid json", () => {
        const actual = flagFormConverter({
            flagKey: testFlagKey, type: "object",
            variants: [{ name: "foo", value: "{a}" }]
        })
        expect(actual[testFlagKey].variants["foo"]).toStrictEqual("")
    })

    it("should return defaultVariant", () => {
        const actual = flagFormConverter({ flagKey: testFlagKey, defaultVariant: "true" })
        expect(actual[testFlagKey].defaultVariant).toBe("true")
    })

    it("should return targeting as object", () => {
        const actual = flagFormConverter({
            flagKey: testFlagKey, hasTargeting: true,
            rules: []
        })
        expect(actual[testFlagKey].targeting).toBeInstanceOf(Object)
    })

    it("should return targeting as empty object if hasTargeting is false", () => {
        const actual = flagFormConverter({ flagKey: testFlagKey, hasTargeting: false })
        expect(actual[testFlagKey].targeting).toStrictEqual({})
    })

    it("should return if as array in targeting if hasTargeting is true", () => {
        const actual = flagFormConverter({ flagKey: testFlagKey, hasTargeting: true, rules: [] })
        expect(actual[testFlagKey].targeting.if).toBeInstanceOf(Array)
    })

    it("should return operator in if", () => {
        const actual = flagFormConverter({
            flagKey: testFlagKey, hasTargeting: true,
            rules: [{condition: { operator: "ends_with" }}]
        })
        expect(actual[testFlagKey].targeting.if[0]["ends_with"]).toBeInstanceOf(Array)
    })

    it("should return var under operator", () => {
        const actual = flagFormConverter({
            flagKey: testFlagKey, hasTargeting: true,
            rules: [{ condition: { name: "email", operator: "ends_with" } }]
        })
        expect(actual[testFlagKey].targeting.if[0]["ends_with"][0].var).toBe("email")
    })

    it("should return value under operator", () => {
        const actual = flagFormConverter({
            flagKey: testFlagKey, hasTargeting: true,
            rules: [{ condition: { value: "@ingen.com", operator: "ends_with" } }]
        })
        expect(actual[testFlagKey].targeting.if[0]["ends_with"][1]).toBe("@ingen.com")
    })

    it("should return array under operator if the value is comma separated", () => {
        const actual = flagFormConverter({
            flagKey: testFlagKey, hasTargeting: true,
            rules: [{ condition: { value: "us,ca", operator: "in" } }]
        })
        expect(actual[testFlagKey].targeting.if[0]["in"][1]).toStrictEqual(["us", "ca"])
    })

    it("should return array of strings with trimmed spaces", () => {
        const actual = flagFormConverter({
            flagKey: testFlagKey, hasTargeting: true,
            rules: [{ condition: { value: "us, ca", operator: "in" } }]
        })
        expect(actual[testFlagKey].targeting.if[0]["in"][1]).toStrictEqual(["us", "ca"])
    })

    it("should return subOperator if it's sementic version comparison", () => {
        const actual = flagFormConverter({
            flagKey: testFlagKey, hasTargeting: true,
            rules: [{ condition: { operator: "sem_ver", subOperator: ">=" } }]
        })
        expect(actual[testFlagKey].targeting.if[0]["sem_ver"][1]).toStrictEqual(">=")
    })

    it("should return value as last element if it's sementic version comparison", () => {
        const actual = flagFormConverter({
            flagKey: testFlagKey, hasTargeting: true,
            rules: [{ condition: { operator: "sem_ver", subOperator: ">=", value: "1.7.0" } }]
        })
        expect(actual[testFlagKey].targeting.if[0]["sem_ver"][2]).toStrictEqual("1.7.0")
    })

    it("should return targetVariant in if", () => {
        const actual = flagFormConverter({
            flagKey: testFlagKey, hasTargeting: true,
            rules: [{ targetVariant: "true" }]
        })
        expect(actual[testFlagKey].targeting.if[1]).toBe("true")
    })
})

