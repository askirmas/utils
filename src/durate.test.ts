import { performance } from "perf_hooks"
import { durate } from "./durate"

describe(durate.name, () => {
  it(Date.name, () => {
    const end = durate(Date.now)
    , duration = end()

    expect(duration).toBe(0)
  })

  it("performance", () => {
    const end = durate(performance.now)
    , duration = end()

    expect(duration).toBeLessThan(1)
  })
})