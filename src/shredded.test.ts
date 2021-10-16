export {}

type Source1 = {
  a: number
  b?: number
}

const patches: Record<string, Shredded<Source1>> = {
  "Change a": {"a": 2},
  "Change b": {"b": 2},
  "Delete b": {"b": null},
  "Delete a": {"a": null},
  //TODO //@ts-expect-error
  "Undef a": {"a": undefined},
  //TODO //@ts-expect-error
  "Undef b": {"a": undefined}
}

it("", () => expect(patches).not.toBe(null))

