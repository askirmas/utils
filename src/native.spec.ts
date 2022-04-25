import { durate, DurationStat, start, stop } from "./durate"
import { describes, expectGraphic, inRange, its } from "./jest"

beforeEach(() => gc!())
afterEach(() => gc!())

describe("Features", () => {
  describe(Array.name, () => {
    it("Fill degradation @ 2^25 ~ 33M", () => {
      const _l25 = durate()
      , arr1 = new Array(2 ** 25).fill(0)
      , l25 = _l25()
      expect(arr1.length).toBe(2 ** 25)

      const _l25_1 = durate()
      , arr2 = new Array(2 ** 25 + 1).fill(0)
      , l25_1 = _l25_1()
      expect(arr2.length).toBe(2 ** 25 + 1)

      expect(l25_1 / l25).toBeGreaterThan(48)
      expect(arr2.length - arr1.length).toBe(1)

      expect(2 ** 25).toBe(33e6 + 554432)
    })
  })

  describe(Map.name, () => {
    it("Capacity 2^24 ~ 16M", () => {
      function fillMap(length: number) {
        const map = new Map()
        for (let i = 0; i < length; i++) {
          map.set(i, 0)
        }
        return map
      }
      
      expect(fillMap(2 ** 24).size).toBe(2 ** 24)
      expect(() => fillMap(2 ** 24 + 1)).toThrow()

      expect(2 ** 24).toBe(16e6 + 777216)
    })
  })

})

describe.only("side", () => {
  const K = 1000, M = 10 ** 6
  , sizes = [
    // 100,
    K,
    10*K,
    100*K,
    M,
    // 10*M,
    // 40*M
  ] as const
  , maxSize = Math.max(...sizes)

  , numStr = (n: number) => {
    const pow = Math.floor(Math.log10(n) / 3)
    , postfix = ["", "K", "M"][pow]
    , val = Math.floor(n / 1000 ** pow)

    return `${val}${postfix}`
  }
  , methods = ["setN", "setY", "getN", "getY"] as const
  , instances = {Array, Map, Object}
  , instanceNames = ["Array", "Map", "Object"] as const
  , measures = {
  } as Record<typeof instanceNames[number], Record<typeof sizes[number], Record<typeof methods[number], Record<"tick"|"total", DurationStat>>>>

  beforeAll(() => {
    for (const l1 of instanceNames) {
      const m1 = measures[l1] = {} as typeof measures[typeof l1]
      for (const l2 of sizes)
        m1[l2] = {} as typeof measures[typeof l1][typeof l2]
    }
  })

  describes(instanceNames, name => {
    for (const size of sizes) describe(numStr(size), () => {
      let instance = new instances[name]()

      its(["setN", "setY"] as const, (method) => {
        const M = measures[name][size]
        , m = M[method] = M[method] ?? {}

        for (let r = Math.min(100, maxSize / size); r--;) {
          let inst = method === "setN" ? instance = new instances[name]()
          : instance

          const startV = {}
          let val = startV

          const set = inst instanceof Map
          //@ts-expect-error
          ? (k: number|string, v: any) => inst.set(k, v)
          //@ts-expect-error
          : (k: number|string, v: any) => inst[k] = v

          start(m, "total")
          for (let i = 0; i < size; i++) {
            // pause(m, "total")
            // start(m, "tick")
            val = set(i, i)
            // stop(m, "tick")
            // start(m, "total")
          }
          stop(m, "total")

          expect(val).not.toBe(startV)
        }
      })
      
      its(["getY", "getN"] as const, method => {
        const M = measures[name][size]
        , m = M[method] = M[method] ?? {}

        for (let r = Math.min(100, maxSize / size); r--;) {
          const inst = instance

          const startV = {}
          let val = startV

          const get = inst instanceof Map
          ? (k: number|string) => inst.get(k)
          //@ts-expect-error
          : (k: number|string) => inst[k]

          , i0 = method === "getY" ? 0 : size
          , iend = i0 + size

          start(m, "total")
          for (let i = i0; i < iend; i++) {
            // pause(m, "total")
            // start(m, "tick")
            val = get(i)
            // stop(m, "tick")
            // start(m, "total")
          }
          stop(m, "total")

          expect(val).toBe(
            method === "getY" ? size - 1 : undefined
          )
        }
      })
    })
  })

  describe("Measured", () => {
    describes(instanceNames, name => {
      for (const m of methods)
      for (const s of ["total", "tick"] as const)
      it(`${s} ${m}`, () => expectGraphic(measures2graphic(measures[name], m, s),
        s === "tick"
        ? ([_, y]) => y
        : ([x, y]) => y / x,
        r => inRange(r, 0.8, 1.2),
      ))
    }) 

    function measures2graphic(
      l1: typeof measures[keyof typeof measures],
      m: keyof typeof l1[keyof typeof l1],
      s: keyof typeof l1[keyof typeof l1][typeof m]
    ) {
      const graphic: Record<string, [x: number, y: number]> = {}

      for (const _s in l1)
        graphic[_s] = [+_s, +l1[_s][m][s]] 

      return graphic
    }
  })
})

describe.skip("new Array", () => {
  const pows = [1, 2, 3, 4, 5, 6, 7, 8] as const
  , maxPow = Math.max(...pows)
  , measures = {} as Record<
    `${typeof pows[number]}-${"tick" | "total"}`
  , DurationStat>

  for (const pow of pows) {
    it(`10^${pow}`, () => {
      const length = 10 ** pow
      , ltick: `${typeof pow}-tick` = `${pow}-tick`
      , ltotal: `${typeof pow}-total` = `${pow}-total`      

      start(measures, ltotal)
      for (let i = 10 ** (maxPow - pow); i--;) {
        start(measures, ltick)
        const arr = new Array(length).fill(0)
        stop(measures, ltick)

        arr.length !== length && expect(arr.length).toBe(length)
      }
      stop(measures, ltotal)
    })
  }

  it("measured", () => expect(measures).toStrictEqual({
    
  }))
})

// Array 2**25=33554432 vs 33554433
// var fillArray = length => {console.time(length);const arr = new Array(length).fill(0); console.timeEnd(length); return arr}
// linear
// var fillObj = length => {console.time(length); let obj = {}; for (let i = length; i--;) obj[i] = 0; console.timeEnd(length); return obj}
// Map 2**24=16777216 vs 16777217
// var fillMap = length => {console.time(length); let map = new Map(); for (let i = length; i--;) map.set(i, 0); console.timeEnd(length); return map}
// c = (l, fn) => {console.time(l); let r = fn(); console.timeEnd(l); return r}
