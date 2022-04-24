import {
  fill,
  sort
} from "./array";
import { durate } from "./durate";
import { idfn } from "./function";
import { expectInRange } from "./jest";

beforeEach(() => gc!())

describe(fill.name, () => {
  describe("Investigate perf", () => {
    const nativeFill = (length: number) => {
      const end = durate()
      new Array(length).fill(0)
      
      const d = end()
      gc!()
      return d
    }
    , manualDemand = (length: number) => {
      const end = durate()
      , arr = new Array() 
      for (let i = 0; i < length; i++)
        arr[i] = 0

      const d = end()
      gc!()
      return d
    }
    , manualPrepared = (length: number) => {
      const end = durate()
      , arr = new Array(length) 
      for (let i = 0; i < length; i++)
        arr[i] = 0

      const d = end()
      gc!()
      return d
    }

    for (const pow of [3, 4, 5, 6] as const)
      describe(`10^${pow}`, () => {
        const length = 10 ** pow

        let native = 0
        , demand = 0
        , prepared = 0

        it("native", () => {native = nativeFill(length)})
        it("demand", () => {demand = manualDemand(length)})
        it("prepared", () => {prepared = manualPrepared(length)})

        it("prepared / native", () => expectInRange(prepared / native, 0.25, 25))
        it("demand / prepared", () => expectInRange(demand / prepared, 0.2, 270))
      })
  })

  it("primitive", () => expect(
    fill(2, 0)
  ).toStrictEqual(
    [0, 0]
  ))

  it("Mixed TS", () => {
    const fn = (() => "string") as 1 | (() => "string")
    , filled = fill(2, fn)
    , tsCheck: typeof filled = [
      "string",
      1,
      //@ts-expect-error
      2
    ]

    tsCheck
    expect(filled).toStrictEqual(["string", "string"])
  })

  it.todo("typing of idfn")
})

describe(Array.prototype.map, () => {
  function map<S extends any[], R>(source: S,
    fn: (value: S[number], index: number, arr: (S[number] | R)[]) => R
  ): R[] {
    const {length} = source
    , array: R[] = []
  
    for (let i = 0; i < length; i++)
      array[i] = fn(source[i], i, array)
  
    return array
  }

  for (const pow of [3, 4, 5, 6]) {
    it(`${pow}`, () => {
      const length = 10 ** pow
      , arr = fill(length, idfn)
      , endNative = durate()
      , r1 = arr.map(idfn)
      , native = endNative()
      , endManual = durate()
      , r2 = map(arr, idfn)
      , manual = endManual()

      expect(r1).toStrictEqual(r2)
      expect(native).toBeLessThan(manual)  
    })
  }
})

describe(sort.name, () => {
  it("demo", () => expect(sort(
    [
      {"key": "a", "value": 1, "id": 3},
      {"key": "b", "value": 2, "id": 4},
      {"key": "b", "value": 2, "id": 2},
      {"key": "a", "value": 3, "id": 1},
    ],
    {
      "key": 1,
      "value": -1
    }
  )).toStrictEqual([
    {"key": "a", "value": 3, "id": 1},
    {"key": "a", "value": 1, "id": 3},
    {"key": "b", "value": 2, "id": 4},
    {"key": "b", "value": 2, "id": 2},
  ]))
})