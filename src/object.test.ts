import {
  pick,
  project
} from "./object";

describe(pick.name, () => {
  const source: Partial<Record<"a"|"b"|"c", number>> = {"a": 1, "b": 1}

  it("no target", () => {
    const result = pick(
      source,
      ["a", "c"]
    )

    expect(result).toStrictEqual({
      "a": 1,
      "c": undefined
    })
  })
  
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

describe(project.name, () => {
  it("demo", () => {
    const obj = {
      "keep": "Keep",
      "remove": "Remove",
      "rename": "Rename",
      "omit": "Omit",
      "replace": "Replace",
      "copy": "Copy",
    }
    , result = project(obj, {
      //@ts-expect-error
      "keep": 1,
      //@ts-expect-error
      "remove": 0,
      "renamed": "rename",
      //@ts-expect-error
      "replace": false,
      "replaced": "replace",
      "copy1": "copy",
      //@ts-expect-error
      "copy": "copy",
      "copy2": "copy",
    })

    expect(obj).toBe(result)
    expect(result).toStrictEqual({
      "keep": "Keep",
      "renamed": "Rename",
      "replaced": "Replace",
      "copy1": "Copy",
      "copy2": "Copy",
    })
  })
})
