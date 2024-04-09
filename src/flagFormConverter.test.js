import { describe, it, expect } from 'vitest'
import flagFormConverter from "./flagFormConverter"

describe("flagFormConverter", () => {
    it("should set flagkey to empty string if undefined", () => {
        const actual = flagFormConverter({ flagKey: undefined })
        expect(actual.flagKey).toBe("")
    })

    it("should preserve flagkey if not undefined", () => {
        const actual = flagFormConverter({ flagKey: "test-feature" })
        expect(actual.flagKey).toBe("test-feature")
    })

    it("should convert state from true to ENABLED", () => {
        const actual = flagFormConverter({ state: true })
        expect(actual.state).toBe("ENABLED")
    })

    it("should convert state from false to DISABLED", () => {
        const actual = flagFormConverter({ state: false })
        expect(actual.state).toBe("DISABLED")
    })
})

