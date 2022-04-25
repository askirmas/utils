import { performance } from "perf_hooks"
import { durate, DurationStat, pause, start, stop } from "./durate"

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

it("item", () => {
  const measures = {} as Record<"item1"|"item2", DurationStat>
  start(measures, "item1")
  start(measures, "item2")
  const {item1, item2} = measures

  item1.n = 2
  item1.t = 2
  item2.n = 1
  item2.t = 4

  expect(item2 / item1).toBe(4)
})

it("pausing", () => {
  const measures = {} as Record<"item1", DurationStat>
  start(measures, "item1")
  pause(measures, "item1")
  start(measures, "item1")
  stop(measures, "item1")

  const d = measures.item1 / 1
  expect(measures.item1).toMatchObject({
    "n": 1,
    "c": 0,
    "M": d,
    "m": d,
    "t": d
  })

  start(measures, "item1")
  stop(measures, "item1")
  expect(measures.item1).toMatchObject({
    "n": 2,
    "c": 0,
    "M": d
  })
  expect(measures.item1.m).toBeLessThan(d)
  expect(measures.item1.t).toBeGreaterThan(d)
})