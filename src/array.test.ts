import { fill } from "./array";
import { durate } from "./durate";
import { idfn } from "./function";

describe(fill.name, () => {
  it("Investigate perf", () => {
    const nativeFill = (length: number) => {
      const end = durate()
      new Array(length).fill(0)

      return end()
    }
    , manualDemand = (length: number) => {
      const end = durate()
      , arr = new Array() 
      for (let i = 0; i < length; i++)
        arr[i] = 0

      return end()
    }
    , manualPrepared = (length: number) => {
      const end = durate()
      , arr = new Array(length) 
      for (let i = 0; i < length; i++)
        arr[i] = 0

      return end()
    }

    for (const length of [1e3, 1e4, 1e5, 1e6]) {
      const native = nativeFill(length)
      , demand = manualDemand(length)
      , prepared = manualPrepared(length) 

      expect(native).toBeLessThan(prepared)
      expect(prepared).toBeLessThan(demand)
    }
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
