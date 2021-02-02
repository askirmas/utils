import deepPatch from "./deep-merge"

describe("simple", () => {
  const source = {"a": "a"}
  it("same", () => expect(deepPatch(source, source)).toBe(source))
  it("no patch", () => expect(deepPatch(source, undefined)).toBe(source))
})

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
    "e"?: number
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
    "d": null,
    "e": 5
  })).toStrictEqual({
    "a": 1,
    "b": 2,
    "c": 3,
    "e": 5
  }))
})

describe("deep", () => {
  const deep: {n: {n: {
    a?: string
    b?: string
    c?: string
  }}} = {
    "n": {
      "n": {
        "a": "a",
        "c": "c"
      }
    }
  }
  , overwrite: typeof deep = {
    "n": {
      "n": {
        "a": "A",
        "c": "c"
      }
    }
  }  
  , patch: Shredded<typeof deep> = {
    "n": {
      "n": {
        "b": "b"
      }
    }
  }
  , sub: Shredded<typeof deep> = {
    "n": {
      "n": {
        "a": "a"
      }
    }
  }

  it("sub", () => expect(deepPatch(deep, sub)).toBe(deep))

  it("overwrite", () => expect(deepPatch(deep, overwrite)).toBe(overwrite))

  it("update", () => expect(deepPatch(deep, patch)).toStrictEqual({
    "n": {
      "n": {
        "a": "a",
        "b": "b",
        "c": "c"
      }
    }
  }))

  describe("delete", () => {
    const delete_patch: Shredded<typeof deep> = {
      "n": {
        "n": {
          "a": null,
          "c": null
        }
      }
    }

    it("option1", () => expect(deepPatch(deep, delete_patch)).toStrictEqual(
      {"n": {"n": {}}}
    ))
    it("not nested empty", () => expect(deepPatch(deep, delete_patch)).not.toStrictEqual(
      {"n": {}}
    ))
    it("not empty object", () => expect(deepPatch(deep, delete_patch)).not.toStrictEqual(
      {}
    ))
    it("not undefined", () => expect(deepPatch(deep, delete_patch)).not.toBe(
      undefined
    ))
  })

})
