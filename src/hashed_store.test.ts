import { HashedStore } from "./hashed_store";
import type { Id } from "./ts-swiss.types";

describe(HashedStore.name, () => {
  type ItemId = Id<"item">
  type Item = {
    "id": ItemId
  }

  const id1 = "id1" as ItemId
  , id2 = "id2" as ItemId
  , item1: Item = {"id": id1}
  , item2: Item = {"id": id2}

  let store: HashedStore<Item, Id<"item">, string>

  beforeEach(() => store = new HashedStore((id: Item["id"]) => id[0]))

  describe(HashedStore.prototype.get.name, () => {
    it("Not exists", () => expect(store
      .get(id1)
    ).toBeUndefined())

    it("Exists", () => expect(store
      .set(id1, item1)
      .get(id1)
    ).toBe(item1))
  })

  describe(HashedStore.prototype.has.name, () => {
    it("false", () => expect(store
      .has(id1)
    ).toBe(false))

    it("true", () => expect(store
      .set(id1, item1)
      .has(id1)
    ).toBe(true))
  })


  describe(HashedStore.prototype.set.name, () => {
    it("Create", () => expect(store
      .set(id1, item1)
      .get(id1)
    ).toBe(item1))

    it("Update", () => expect(store
      .set(id1, item1)
      .set(id1, item2)
      .get(id1)
    ).toBe(item2))
  })

  describe(HashedStore.prototype.delete.name, () => {
    it("On empty", () => expect(store
      .delete(id1))
    .toBe(false))

    it("deleting", () => {
      store.set(id1, item1)

      expect([
        store.delete(id1),
        store.delete(id1)
      ]).toStrictEqual([
        true,
        false
      ])
    })

    it("Clearness", () => {
      store.set(id1, item1).set(id2, item2)
  
      store.delete(id1)
      store.delete(id2)
      //@ts-expect-error
      expect(store.store.size).toBe(0)
    })  
  })

  it(HashedStore.prototype.forEach.name, () => {
    const values: Item[] = []

    store.set(id1, item1).set(id2, item2)
    .forEach(value => values.push(value))

    expect(values).toStrictEqual([item1, item2])
  })
})
