import { randomBytes } from "crypto";
import { fill } from "./array";
import { durate } from "./durate";
import type { Dict } from "./ts-swiss.types";
import { WideStore } from "./wide_store";

const number = expect.any(Number)

describe(WideStore.name, () => {

  describe("units", () => {
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

  describe.only("Perf compare", () => {
    type T = {"id": string}

    const newObj = () => ({"id": randomBytes(8).toString("base64")})
    , objs = fill(64 * 64 * 32, newObj)
    , g = false
    , sources = {
      "assoc": {} as Dict<T>,
      "map": new Map<string, T>(),
      "store1": new WideStore<T, "id">("id", id => [id[0], id]),
      "store2": new WideStore<T, "id">("id", id => [id.substring(0, 2), id]),
      "store3": new WideStore<T, "id">("id", id => [id[0], id[1], id])
    }
    , newDurations = () => {
      const durations: Record<keyof typeof sources, number> = {
        "assoc": 0, 
        "map": 0,
        "store1": 0,
        "store2": 0,
        "store3": 0
      }

      return durations
    }

    it("set", () => {
      const durations = newDurations()
      
      for (let i = objs.length; i--;) {
        const obj = objs[i]
        , {id} = obj
        , {assoc, map, store1, store2, store3} = sources

        , assocEnd = durate()
        , assocDur = (
          assoc[id] = obj,
          assocEnd()
        )

        , mapEnd = durate()
        , mapDur = (
          map.set(id, obj),
          mapEnd()
        )

        , store1End = durate()
        , store1Dur = (
          store1.set(obj),
          store1End()
        )

        , store2End = durate()
        , store2Dur = (
          store2.set(obj),
          store2End()
        )

        , store3End = durate()
        , store3Dur = (
          store3.set(obj),
          store3End()
        )

        g && gc!()

        durations.assoc += assocDur
        durations.map += mapDur
        durations.store1 += store1Dur
        durations.store2 += store2Dur
        durations.store3 += store3Dur
      }


      expect(Object.entries(durations).sort((e1, e2) => e2[1] - e1[1])).toStrictEqual([
        ["store2", number],
        ["assoc", number],
        ["store1", number],
        ["store3", number],
        ["map", number],
      ])
    })

    it("get", () => {
      const durations = newDurations()
      
      for (let i = objs.length; i--;) {
        const {id} = i % 2 ? objs[i] : newObj()
        , {assoc, map, store1, store2, store3} = sources

        , assocEnd = durate()
        , assocDur = (
          assoc[id],
          assocEnd()
        )

        , mapEnd = durate()
        , mapDur = (
          map.get(id),
          mapEnd()
        )

        , store1End = durate()
        , store1Dur = (
          store1.get(id),
          store1End()
        )

        , store2End = durate()
        , store2Dur = (
          store2.get(id),
          store2End()
        )

        , store3End = durate()
        , store3Dur = (
          store3.get(id),
          store3End()
        )

        g && gc!()
        
        durations.assoc += assocDur
        durations.map += mapDur
        durations.store1 += store1Dur
        durations.store2 += store2Dur
        durations.store3 += store3Dur
      }

      expect(Object.entries(durations).sort((e1, e2) => e2[1] - e1[1])).toStrictEqual([
        ["store2", number],
        ["assoc", number],
        ["store1", number],
        ["map", number],
        ["store3", number],
      ])
    })    
  })
})
