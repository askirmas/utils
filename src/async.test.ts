import { $all, immediate, nextTick, sleep } from "./async";
import { durate } from "./durate";

describe($all.name, () => {
  it("demo", async () => {
    const result: {
      "number": number
      "promStr": string
    } = await $all({
      "number": 1,
      "promStr": Promise.resolve("2"),
    })

    expect(result).toStrictEqual({
      "number": 1,
      "promStr": "2",
    })
  })
})

describe(sleep.name, () => {
  it("demo", async () => {
    const end = durate()
    await sleep(100)
    const duration = end()
    
    expect(duration).toBeGreaterThanOrEqual(100)
    expect(duration).toBeLessThan(110)
  })
})

it("node loop", async () => {
  const acc: string[] = []

  await Promise.all([
    immediate().then(() => acc.push(immediate.name)),
    nextTick().then(() => acc.push(nextTick.name)),
  ])

  expect(acc).toStrictEqual([
    nextTick.name,
    immediate.name
  ])
})