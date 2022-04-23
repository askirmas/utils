import { WideStore } from "./wide_store";

describe(WideStore.name, () => {
  type T = {
    "id": string
    "v": number
  }

  const store = new WideStore("id", id => [id[0], id.substring(0, 2), id], {} as T);

  beforeEach(() => store.reset())

  it("Empty", () => expect(store.size).toBe(0))

  it(store.get.name, () => expect(store
    .get("a1")
  ).toBe(
    undefined
  ))

  it(store.add.name, () => expect(store
    .add({"id": "a1", "v": 1})
    .add({"id": "a1", "v": 2})
    .get("a1")
  ).toMatchObject(
    {"id": "a1", "v": 1}
  ))        

  it(store.set.name, () => expect(store
    .set({"id": "a1", "v": 1})
    .set({"id": "a1", "v": 2})
    .get("a1")
  ).toMatchObject(
    {"id": "a1", "v": 2}
  ))        

  it(store.has.name, () => expect([
    store.has("a1"),
    store.add({"id": "a1", "v": 1}).has("a1"),
  ]).toStrictEqual([
    false,
    true
  ]))

  describe(store.delete.name, () => {
    it("Not exists 1", () => expect(store
      .delete("a1")
    ).toBe(undefined))

    it("Not exists 2", () => expect(store
      .add({"id": "a11", "v": 1})
      .delete("a1")
    ).toBe(undefined))

    it("Add", () => expect(store
      .add({"id": "a1", "v": 1})
      .delete("a1")
    ).toStrictEqual(
      {"id": "a1", "v": 1}
    ))
  })

  it("TDD store is clear", () => {
    store.add({"id": "a1", "v": 1}).delete("a1")

    //@ts-expect-error
    expect(store.store).not.toStrictEqual({})
    //@ts-expect-error
    expect(store.store).toStrictEqual(
      new Map().set("a", new Map([["a1", new Map()]]))
    )
  })
})
