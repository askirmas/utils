import deepPatch from "./deep-merge"

it("scalar", () => expect(deepPatch("a", "b")).toBe("b"))

describe("array", () => {
  const arr = ["a"]
  , p1 = ["b"]
  , difLength = ["a", "b"]

  it("same", () => expect(deepPatch(arr,
    ["a"]
  )).toBe(
    arr
  ))

  it("overwrite", () => expect(deepPatch(arr,
    p1
  )).toBe(
    p1
  ))

  it("overwrite due to length", () => expect(deepPatch(arr,
    difLength
  )).toBe(
    difLength
  ))
})


describe("flat assoc", () => {
  const source: {
    "a": number
    "b"?: number
    "c": number
    "d"?: number
  } = {"a": 1, "b": 2, "c": 3}

  it("subset", () => expect(deepPatch(source, {
    "a": 1
  })).toBe(
    source
  ))

  it("delete", () => expect(deepPatch(source, {
    "b": null
  })).toStrictEqual({
    "a": 1,
    "c": 3
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
  const deep = {
    "nested": {
      "a": "a"
    }
  }
  , patch = {
    "nested": {
      "a": "b"
    }
  }

  describe("overwrite", () => {
    it("equal", () => expect(deepPatch(deep, patch)).toStrictEqual(patch))
    it("be", () => expect(deepPatch(deep, patch)).toBe(patch))
  })
})

describe("deep delete", () => {
  const depth: {n: {n: {a?: string}}} = {
    "n": {
      "n": {
        "a": "a"
      }
    }
  }
  , patch = {
    "n": {
      "n": {
        "a": null
      }
    }
  }

  it("option1", () => expect(deepPatch(depth, patch)).toStrictEqual(
    {"n": {"n": {}}}
  ))
  it("not nested empty", () => expect(deepPatch(depth, patch)).not.toStrictEqual(
    {"n": {}}
  ))
  it("not empty object", () => expect(deepPatch(depth, patch)).not.toStrictEqual(
    {}
  ))
  it("not undefined", () => expect(deepPatch(depth, patch)).not.toBe(
    undefined
  ))
})
