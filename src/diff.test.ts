import deepDiff from "./diff";

describe("fu", () => {
  const result = deepDiff(
    [
      "x",
      {"a": "1", "b": 1}
    ],
    [
      {"a": "0", "b": 1},
      {"a": "1", "b": 1}
    ] 
  )

  it("result", () => expect(result).toStrictEqual([
    [
      "x",
      {"a": undefined, "b": undefined},
      {"a": "1", "b": 1}
    ],
    [
      undefined,
      {"a": "0", "b": 1},
      {"a": "1", "b": 1}
    ],
  ]))

  it(".resolve", () => expect(result).not.toStrictEqual([
    [
      "x",
      undefined,
      {"a": "1", "b": 1}
    ],
    [
      undefined,
      {"a": "0", "b": 1},
      {"a": "1", "b": 1}
    ],
  ]))

  it(".nested equal", () => expect(result[0][2]).not.toBe(result[1][2]))
})
