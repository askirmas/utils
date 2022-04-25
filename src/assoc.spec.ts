import { randomBytes } from "crypto"
import { fill } from "./array"
import type { DurationStat } from "./durate"
import {
  start,
  stop
} from "./durate"
import { expectInRange } from "./jest"
import type {
  Dict,
  Entry
} from "./ts-swiss.types"

let gced = 0

beforeEach(() => {gced++; gc!()})

describe("perf", () => {
  const newId = () => randomBytes(6).toString("hex")
  , pow = 6

  describe(`10^${pow}`, () => {
    const sources = {
      "map_native": new Map<string, {}>(),
      "obj_native": {} as Dict<{}>,
    }
    , measures = {
      "rewrite": {},
      "getY": {},
      "getN": {},
      "set": {},
      "values": {}
    } as Record<"rewrite"|"getY"|"getN"|"set"|"values", Record<keyof typeof sources, DurationStat>>
    , batchSize = Math.round(5 * 10 ** (pow - 1))

    let ids: string[]
    , items: {"id": string}[]

    beforeAll(() => {
      const idSet: Set<string> = new Set(fill(3 * batchSize, newId))

      while (idSet.size < 3 * batchSize)
        idSet.add(newId())
  
      const ids = Array.from(idSet)
      , items: {"id": string}[] = []
  
      idSet.clear()
  
      for (let i = batchSize; i < 3 * batchSize; i ++)
        items.push({"id": ids[i]})
  
      ids.length = 2 * batchSize  
    })
    
    for (const [name, source] of Object.entries(sources) as Entry<typeof sources>[]) {
      for (const method of ["set", "rewrite"] as const)
        describe(method, () => {
          it(name, () => {
            for (let s = items.length ; s--;) {
              const obj = items[s]
              , m = measures[method]

              switch (name as keyof typeof sources) {
                case "obj_native":
                  start(m, name)
                  //@ts-expect-error
                  source[obj.id] = obj
                  stop(m, name)
                  break;
                case "map_native":
                  start(m, name)
                  //@ts-expect-error
                  source.set(obj.id, obj)
                  stop(m, name)
                  break
              }
            }

            source instanceof Map && expect(source.size).toBe(items.length)
          })
        })

      describe("getY", () => {
        it(name, () => {
          let val = null

          for (let i = ids.length ; i-- > batchSize;) {
            const m = measures.getY
            , id = ids[i]
            switch (name as keyof typeof sources) {
              case "obj_native":
                start(m, name)
                //@ts-expect-error
                val = source[id]
                stop(m, name)
                break;
              case "map_native":
                start(m, name)
                //@ts-expect-error
                val = source.get(id)
                stop(m, name)
                break
            }

            expect(val).toBe(items[i - batchSize])
          }
        })
      })

      describe("getN", () => {
        it(name, () => {
          let val = null

          for (let i = batchSize; i--;) {
            const m = measures.getN

            switch (name as keyof typeof sources) {
              case "obj_native":
                start(m, name)
                //@ts-expect-error
                val = source[ids[i]]
                stop(m, name)
                break;
              case "map_native":
                start(m, name)
                //@ts-expect-error
                val = source.get(ids[i])
                stop(m, name)
                break
            }

            expect(val).toBeUndefined()
          }
        })        
      })

      describe("values", () => {
        it(name, () => {
          const m = measures.values
          let val

          switch (name) {
            case "obj_native":
              start(m, name)
              for (const key in source)
                //@ts-expect-error
                val = source[key]
              stop(m, name)
              break
            case "map_native":
              start(m, name)
              // for (const _ of source.values()) {}
              source.forEach(v => val = v)
              stop(m, name)
              break
          }

          val
        })
      })
    }

    describe("compare", () => {
      it("set", () => {
        const {map_native, obj_native} = measures.set

        expect(map_native.n).toBe(obj_native.n)
        expectInRange(obj_native.t / map_native.t, 1.4, 4.4)
      })

      it("rewrite", () => {
        const {map_native, obj_native} = measures.rewrite

        expect(map_native.n).toBe(obj_native.n)
        expectInRange(obj_native.t / map_native.t, 0.6, 0.8)
      })


      it("getY", () => {
        const {map_native, obj_native} = measures.getY

        expect(map_native.n).toBe(obj_native.n)
        expectInRange(obj_native.t / map_native.t, 2.1, 4)
      })

      it("getN", () => {
        const {map_native, obj_native} = measures.getN

        expect(map_native.n).toBe(obj_native.n)
        expectInRange(obj_native.t / map_native.t, 4.5, 11)
      })

      it("values", () => {
        const {map_native, obj_native} = measures.values

        expect(map_native.n).toBe(obj_native.n)
        expectInRange(obj_native.t / map_native.t, 8, 40)
      })
    })
  })
})

describe("gc", () => it("gc", () => expect(gced).toBe(16)))
