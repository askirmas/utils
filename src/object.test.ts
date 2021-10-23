import { pick } from "./object";

describe(pick.name, () => {
  
  describe("array", () => {
    const source: Partial<Record<"a"|"b"|"c", number>> = {"a": 1, "b": 1}

    it("no target", () => expect(pick(
      source,
      ["a", "c"]
    )).toStrictEqual({
      "a": 1,
      "c": undefined
    }))
    
    it("with target", () => expect(pick(
      source,
      ["a", "c"],
      {"a": 2, "b": 2, "c": 2} as typeof source
    )).toStrictEqual({
      "a": 1,
      "b": 2,
      "c": undefined
    }))
  })
})