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
    } as const
    , expectation = {
      "keep": "Keep",
      "renamed": "Rename",
      "replaced1": "Replace",
      "replaced2": "Replace",
      "copy": "Copy",
      "copy1": "Copy",
      "copy2": "Copy",
      "copy3": "Copy",
    } as const
    , result: typeof expectation = project(obj, {
      "keep": 1,
      "remove": 0,
      "renamed": "rename",
      "replace": false,
      "replaced1": "replace",
      "replaced2": "replace",
      "copy1": "copy",
      "copy": "copy",
      "copy2": "copy",
      "copy3": "copy",
    })

    expect(obj).toBe(result)
    expect(result).toStrictEqual(expectation)
  })

  it("TDD swap", () => {
    const result = project({
      "swap1": 1,
      "swap2": 2
    }, {
      "swap2": "swap1",
      "swap1": "swap2"
    })

    expect(result).not.toStrictEqual({
      "swap1": 2,
      "swap2": 1
    })
    expect(result).toStrictEqual({
      "swap1": 1
    })
  })
})
