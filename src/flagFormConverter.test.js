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
        const actual = flagFormConverter({ flagKey: testFlagKey, variants: []})
        expect(actual[testFlagKey].variants).toStrictEqual({})
    })

    it("should return 1 variant", () => {
        const actual = flagFormConverter({ flagKey: testFlagKey, 
            variants: [{ name: "true", value: true }]})
        expect(actual[testFlagKey].variants).toStrictEqual({ true: true })
    })

    it("should return 2 variants", () => {
        const actual = flagFormConverter({ flagKey: testFlagKey, 
            variants: [{ name: "true", value: true }, { name: "false", value: false }]})
        expect(actual[testFlagKey].variants).toStrictEqual({ true: true, false: false })
    })

    it("should return json object if variant value is valid json", () => {
        const actual = flagFormConverter({ flagKey: testFlagKey, type: "object",
            variants: [{ name: "foo", value: "{}" }]})
        expect(actual[testFlagKey].variants["foo"]).toStrictEqual({})   
    })

    it("should return empty string if variant value is not valid json", () => {
        const actual = flagFormConverter({ flagKey: testFlagKey, type: "object",
        variants: [{ name: "foo", value: "{a}" }]})
        expect(actual[testFlagKey].variants["foo"]).toStrictEqual("") 
    })

    it("should return defaultVariant", () => {
        const actual = flagFormConverter({ flagKey: testFlagKey, defaultVariant: "true" })
        expect(actual[testFlagKey].defaultVariant).toBe("true")
    })

})

