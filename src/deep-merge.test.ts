import { deepMerge } from "./deep-merge"

describe(deepMerge.name, () => {
  describe("simple", () => {
    const source = {"a": "a"}
    it("same", () => expect(deepMerge(source, source)).toBe(source))
    it("no patch", () => expect(deepMerge(source, undefined)).toBe(source))
  })

  it("scalar", () => expect(deepMerge("a", "b")).toBe("b"))

  describe("array", () => {
    const arr = ["a"]
    , p1 = ["b"]
    , difLength = ["a", "b"]

    it("same", () => expect(deepMerge(arr,
      ["a"]
    )).toBe(
      arr
    ))

    it("overwrite", () => expect(deepMerge(arr,
      p1
    )).toBe(
      p1
    ))

    it("overwrite with patch", () => expect(deepMerge(arr,
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

    it("subset", () => expect(deepMerge(source, {
      "a": 1
    })).toBe(
      source
    ))

    it("delete", () => expect(deepMerge(source, {
      "b": null
    })).toStrictEqual({
      "a": 1,
      "c": 3
    }))

    it("merge", () => expect(deepMerge(source, {
      "a": 1,
      "c": 3
    })).toStrictEqual({
      "a": 1,
      "b": 2,
      "c": 3
    }))

    it("merge with undefined", () => expect(deepMerge(source, {
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

    it("sub", () => expect(deepMerge(deep, sub)).toBe(deep))

    it("overwrite", () => expect(deepMerge(deep, overwrite)).toBe(overwrite))

    it("update", () => expect(deepMerge(deep, patch)).toStrictEqual({
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

      it("option1", () => expect(deepMerge(deep, delete_patch)).toStrictEqual(
        {"n": {"n": {}}}
      ))
      it("not nested empty", () => expect(deepMerge(deep, delete_patch)).not.toStrictEqual(
        {"n": {}}
      ))
      it("not empty object", () => expect(deepMerge(deep, delete_patch)).not.toStrictEqual(
        {}
      ))
      it("not undefined", () => expect(deepMerge(deep, delete_patch)).not.toBe(
        undefined
      ))
    })

  })
})
