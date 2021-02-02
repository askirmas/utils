import deepPatch from "./deep-merge"

it("scalar", () => expect(deepPatch("a", "b")).toBe("a"))

describe("not patchable", () => {
  const flat = ["a"]
  , nested: {
    "array": unknown[]
    "b": null|string
  }= {"array": ["a"], "b": null}
  
  it("flat", () => expect(deepPatch(flat, ["b"])).toBe(flat))

  it("nested", () => expect(deepPatch(nested, {"array": ["b"], "b": "1"})).toBe(nested))
})

describe("flat assoc", () => {
  const source: {
    "a": number
    "b": number
    "c"?: number
    "d"?: number
  } = {"a": 1, "b": 2}

  it("subset", () => expect(deepPatch(source, {
    "a": 1
  })).toBe(
    source
  ))

  it("delete", () => expect(deepPatch(source, {
    "b": null
  })).toStrictEqual({
    "a": 1
  }))

  it("merge", () => expect(deepPatch(source, {
    "a": 1,
    "c": 3
  })).toStrictEqual({
    "a": 1,
    "b": 2,
    "c": 3
  }))

  it("merge with undefined", () => expect(deepPatch(source, {
    "a": 1,
    "b": undefined,
    "c": 3,
    "d": null
  })).toStrictEqual({
    "a": 1,
    "b": 2,
    "c": 3
  }))
})

describe("nested", () => {
  const depth1 = {
    "nested": {
      "a": "a"
    }
  }
  , patch1 = {
    "nested": {
      "a": "b"
    }
  }

  describe("overwrite", () => {
    it(".equal", () => expect(deepPatch(depth1, patch1)).not.toStrictEqual(patch1))
    it(".be", () => expect(deepPatch(depth1, patch1)).not.toBe(patch1))
  })
})