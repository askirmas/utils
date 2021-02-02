import deepPatch from "./deep-merge"

it("no source", () => {
  const patch = ["a"]
  expect(deepPatch(undefined, patch)).toBe(patch)
})
it("scalar", () => expect(deepPatch("a", "b")).toBe("a"))
it("null overwrite", () => expect(deepPatch("a", null)).toBe(undefined))
it("array not patchable", () => {
  const source = ["a"]
  expect(deepPatch(source, ["b"])).toBe(source)
})

describe("flat objects", () => {
  const source = {"a": 1, "b": 2}

  //@ts-expect-error
  it("subset", () => expect(deepPatch(source, {
    "a": 1
  })).toBe(
    source
  ))
  //@ts-expect-error
  it("delete", () => expect(deepPatch(source, {
    // ts-expect-error
    "b": null
  })).toStrictEqual({
    "a": 1
  }))
  it("merge", () => expect(deepPatch(source, {
    "a": 1,
    //@ts-expect-error
    "c": 3
  })).toStrictEqual({
    "a": 1,
    "b": 2,
    "c": 3
  }))
  it("merge with undefined", () => expect(deepPatch(source, {
    "a": 1,
    //@ts-expect-error
    "b": undefined,
    "c": 3,
    // ts-expect-error
    "d": null
  })).toStrictEqual({
    "a": 1,
    "b": 2,
    "c": 3
  }))

})

