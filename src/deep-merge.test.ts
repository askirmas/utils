import { deepMerge } from "./deep-merge"

describe(deepMerge.name, () => {
  it("primitive", () => expect(deepMerge("a", "b")).toBe("b"))

  describe("singleton", () => {
    const source = {"a": "a"}

    it("same", () => expect(deepMerge(source, source)).toBe(source))
    it("clone", () => expect(deepMerge(source, {...source})).toBe(source))
    it("empty", () => expect(deepMerge(source, {})).toBe(source))
    it("no patch", () => expect(deepMerge(source, undefined)).toBe(source))
    it("patch", () => expect(deepMerge({} as typeof source, source)).toBe(source))
  })

  describe("array", () => {
    const arr = ["a"]
    , p1 = ["b"]
    , more = ["a", "b"]

    it("clone", () => expect(deepMerge(arr, ["a"])).toBe(arr))
    it("overwrite", () => expect(deepMerge(arr, p1)).toBe(p1))
    it("patch", () => expect(deepMerge(arr, more)).toBe(more))
  })

  it("assoc", () => {
    const s = {
      "same": "same",
      "untouched": "untouched",
      "undefined": "undefined",
      "delete": "delete",
      "modify": "1" as string|number,
      "overwrite": {"0": 0}
    } as const
    , source = s as Partial<typeof s & {"add": "add"}>
    , patch = {
      "same": "same",
      "undefined": undefined,
      "delete": null,
      "already deleted": null,
      "modify": 1,
      "overwrite": [0],
      "add": "add",
    } as const
    , merged = {
      "same": "same",
      "untouched": "untouched",
      "undefined": "undefined",
      "modify": 1,
      "overwrite": [0],
      "add": "add"
    }

    expect(deepMerge(source, patch)).toStrictEqual(merged)
    expect(deepMerge({"deep": source}, {"deep": patch})).toStrictEqual({"deep": merged})
  })  
})
