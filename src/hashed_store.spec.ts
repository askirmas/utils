import { randomBytes } from "crypto"
import { fill } from "./array"
import type { DurationStat } from "./durate"
import {
  durate,
  start,
  stop
} from "./durate"
import { getMap, getObj, HashedMap, HashedObj, setMap, setObj } from "./hashed_store"
import { expectInRange } from "./jest"
import type { Id } from "./ts-swiss.types"


beforeEach(() => gc!())

describe.skip("hash compare", () => {
  const {substring} = ""
  , d2 = [0, 2] as const
  const hashings = {
    "substring2": (str: string) => str.substring(0, 2),
    "call": (str: string) => substring.call(str, 0, 2),
    //@ts-expect-error
    "apply": (str: string) => substring.apply(str, d2),
    "substr2": (str: string) => str.substr(0, 2),
    "slice2": (str: string) => str.slice(0, 2),
    
    "lit2": (str: string) => `${str[0]}${str[1]}`,
    "add2": (str: string) => str[0] + str[1],
    "arg2": ({0: c0, 1: c1}: string) => c0 + c1,

    // "add3": (str: string) => str[0] + str[1] + str[2],
    // "substring3": (str: string) => str.substring(0, 3),
    // "lit3": (str: string) => `${str[0]}${str[1]}${str[2]}`,
  }
  , m = {} as Record<keyof typeof hashings, number>

  it("measuring", () => {
    for (let l1 = 1000; l1--;)
      for (const _k in hashings) {
        const key = _k as keyof typeof hashings
        , hash = hashings[key]
        , str = randomBytes(2).toString("base64url")
        , ending = durate()
        for (let l2 = 1000; l2--;)
          hash(str)
        const end = ending()
        m[key] = (m[key] ?? 0) + end
      }
  })

  //@ts-expect-error
  it("sort", () => expect(Object.keys(m).sort((m1, m2) => m[m1] - m[m2])).toStrictEqual([
    "call",
    "lit2",
    "apply",
    "substr2",
    "slice2",
    "substring2",
    "add2",
    "arg2"
  ]))
})

describe("perf", () => {
  const newId = () => randomBytes(6).toString("hex") as ItemId
  , batchSize = 5 * 10 ** (6 - 1)

  type ItemId = Id<"item">
  type Item = {
    "id": ItemId
  }

  const stores = {
    "map": new Map<ItemId, Item>(),
    "dict": {} as Record<ItemId, Item>,
    "map2": new Map() as HashedMap<ItemId, Item>,
    "map3": new Map() as HashedMap<ItemId, Item>,
    "obj2": {} as HashedObj<ItemId, Item>,
    "obj3": {} as HashedObj<ItemId, Item>, 
  }
  , measures = {
    "set": {},
    "rewrite": {},
    "getN": {},
    "getY": {}
  } as Record<"set"|"rewrite"|"getN"|"getY", Record<keyof typeof stores, DurationStat>>

  let ids: ItemId[]
  , items: Item[]

  beforeAll(() => {
    const idsSet = new Set(fill(3 * batchSize, newId))
    while (idsSet.size < 3 * batchSize)
      idsSet.add(newId())
    
    ids = Array.from(idsSet)
    //@ts-expect-error TODO `fill` notation
    items = fill(2 * batchSize, i => ({"id": ids[batchSize + i]}))
    ids.length = 2 * batchSize
  })

  for (const method of ["set", "rewrite"] as const)
    describe(method, () => {
      for (const _name in stores)
        it(_name, () => {
          const name = _name as keyof typeof stores

          for (let i = items.length; i--;) {
            const store = stores[name]
            , m = measures[method]
            , item = items[i]
            , {id} = item
            //@ts-expect-error
            , fn = (["map", "store1", "store2"] as const).includes(name)  ? () => store.set(id, item)
            //@ts-expect-error
            : name === "dict" ? () => store[id] = item
            //@ts-expect-error
            : name === "map2" ? () => setMap(store, 2, id, item)
            //@ts-expect-error
            : name === "map3" ? () => setMap(store, 3, id, item)
            //@ts-expect-error
            : name === "obj2" ? () => setObj(store, 2, id, item)
            //@ts-expect-error
            : name === "obj3" ? () => setObj(store, 3, id, item)
            : undefined!

            start(m, name)
            fn()
            stop(m, name)
          }
        })
    })

  for (const method of ["getN", "getY"] as const)
    describe(method, () => {
      for (const _name in stores)
        it(_name, () => {
          const name = _name as keyof typeof stores
          let val = null

          for (let i = batchSize; i--;) {
            const store = stores[name]
            , m = measures[method]
            , id = ids[i + (method === "getY" ? batchSize : 0)]
            //@ts-expect-error
            , fn = (["map", "store1", "store2"] as const).includes(name)  ? () => val = store.get(id)
            //@ts-expect-error
            : name === "dict" ? () => val = store[id]
            //@ts-expect-error
            : name === "map2" ? () => val = getMap(store, 2, id)
            //@ts-expect-error
            : name === "map3" ? () => val = getMap(store, 3, id)
            //@ts-expect-error
            : name === "obj2" ? () => val = getObj(store, 2, id)
            //@ts-expect-error
            : name === "obj3" ? () => val = getObj(store, 3, id)
            : undefined!
            
            start(m, name)
            fn()
            stop(m, name)

            method === "getN" && val !== undefined && expect(val).toBeUndefined()
            method === "getY" && val === undefined && expect(val).toBe(items[i])
          }
        })
    })

  describe("measured", () => {
    it("count", () => {
      const vals = []
      , expects = []

      for (const [method, m] of Object.entries(measures))
        for (const [storeName, {n}] of Object.entries(m)) {
          vals.push([method, storeName, n])
          expects.push([method, storeName, batchSize * (
            ["getY", "getN"].includes(method) ? 1 : 2
          )])
        }

      expect(vals).toStrictEqual(expects)
    })

    describe("sources count", () => {
      const size = 2 * batchSize
      it("map", () => expect(stores.map.size).toBe(size))
      it("dict", () => {
        let dictSize = 0
        for (const _ in stores.dict)
          dictSize++
        expect(dictSize).toBe(size)
      })
      it.skip("store1", () => {
        let storeSize = 0
        //@ts-expect-error
        stores.store1.store.forEach(v => storeSize+=v.size)
        expect(storeSize).toBe(size)
      })
      it.skip("store2", () => {
        let storeSize = 0
        //@ts-expect-error
        stores.store2.store.forEach(v => storeSize+=v.size)
        expect(storeSize).toBe(size)
      })
    })

    describe("hits", () => {
      it.skip("store1", () => {
        let min = Infinity, max = 0
        //@ts-expect-error
        const store: Map<unknown, Map> = stores.store1.store
        
        store.forEach(({size}) => {
          min > size && (min = size)
          max < size && (max = size)
        })

        expect(min).toBeGreaterThan(3700)
        expect(max).toBeLessThan(4200)
        expectInRange(store.size, 200, 256)
      })

      it.skip("store2", () => {
        let min = Infinity, max = 0
        //@ts-expect-error
        const store: Map<unknown, Map> = stores.store1.store

        store.forEach(({size}) => {
          min > size && (min = size)
          max < size && (max = size)  
        })

        expect(min).toBeGreaterThan(3700)
        expect(max).toBeLessThan(4200)

        expectInRange(store.size, 200, 256)
      })      
    })

    describe("set", () => {
      const m = measures.set  
      it("dict > map"     , () => expectInRange(m.dict/m.map     , 1.5, 2.6))
      it("map2 > map"     , () => expectInRange(m.map2/m.map     , 1.3, 2.6))
      it("map3 > map"     , () => expectInRange(m.map3/m.map     , 1.5, 2.6))
      it("dict > obj2"    , () => expectInRange(m.dict/m.obj2   , 1.5, 1.7))
      it("obj3 > dict"    , () => expectInRange(m.obj3/m.dict   , 1.05, 1.2))
    })

    describe("rewrite", () => {
      const m = measures.rewrite
      it("map > dict"     , () => expectInRange(m.map/m.dict     , 1.3, 1.9))

      it("map2 > map"     , () => expectInRange(m.map2/m.map   , 1.5, 2.6))
      it("map3 > map"     , () => expectInRange(m.map3/m.map   , 1.5, 2.6))
      it("obj2 > dict"     , () => expectInRange(m.obj2/m.dict   , 1.5, 2.6))
      it("obj3 > dict"     , () => expectInRange(m.obj3/m.dict   , 1.5, 2.6))
    })

    describe("getN", () => {
      const m = measures.getN
      it("dict > map"     , () => expectInRange(m.dict/m.map   , 1.15, 2))

      it("map2 > map"     , () => expectInRange(m.map2/m.map   , 1.1, 2.6))
      it("map3 > map"     , () => expectInRange(m.map3/m.map   , 1.2, 2.6))
      it("dict > obj2"     , () => expectInRange(m.dict/m.obj2   , 1.9, 2.1))
      it("dict > obj3"     , () => expectInRange(m.obj3/m.dict   , 0.6, 1.5))
    })

    describe("getY", () => {
      const m = measures.getY
      it("map > dict"     , () => expectInRange(m.map/m.dict     , 0.9, 1.72))

      it("map2 > map"     , () => expectInRange(m.map2/m.map   , 1.2, 2.6))
      it("map3 > map"     , () => expectInRange(m.map3/m.map   , 1.48, 2.6))
      it("obj2 > dict"     , () => expectInRange(m.obj2/m.dict   , 1.2, 2.6))
      it("obj3 > dict"     , () => expectInRange(m.obj3/m.dict   , 1.49, 1.6))
    })
  })
})
