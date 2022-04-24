import { expect } from "@jest/globals"

export {
  expectInRange
}

/* istanbul ignore next */
function expectInRange(n: number, min: number, max: number) {
  switch (true) {
    case n < min:
      expect(n).toBeGreaterThan(min)
    case n > max:
      expect(n).toBeLessThan(max)
  }
}