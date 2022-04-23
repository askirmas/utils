import { $all } from "./async";

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