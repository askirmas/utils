import { expect } from "@jest/globals"

export {
  inRange,
  expectInRange,
  expectGraphic,
  describes,
  its
}

/* istanbul ignore next */
function expectInRange(n: number, min: number, max: number) {
  switch (true) {
    case isNaN(n):
      expect(n).not.toBeNaN()
    case n < min:
      expect(n).toBeGreaterThanOrEqual(min)
    case n > max:
      expect(n).toBeLessThanOrEqual(max)
  }
}

function inRange(n: number, min: number, max: number) {
  return isNaN(n) ? n
  : n < min ? min 
  : n > max ? max
  : n
}

function expectGraphic<V, K extends string|number>(
  graphic: Record<K, V>,
  interpolation: (value: V, key: K) => number,
  expectation: (ratio: number, key: K) => number
) {
  const {actual, expected} = graphics(graphic, interpolation, expectation)

  return expect(actual).toStrictEqual(expected)
}

function graphics<V, K extends string|number>(
  graphic: Record<K, V>,
  interpolation: (value: V, key: K) => number,
  expectation: (ratio: number, key: K) => number
) {
  const actual = {} as Record<K, number>
  , expected = {} as Record<K, number>

  let n = 0, sum = 0
  // , min = Infinity, max = -Infinity

  for (const key in graphic) {
    const v = interpolation(graphic[key], key)
    actual[key] = v

    n++
    sum += v
    // min > v && (min = v)
    // max < v && (max = v)    
  }

  const avg = sum / n

  for (const key in graphic) {
    const ratio = actual[key] = actual[key] / avg
    expected[key] = expectation(ratio, key)
  }

  return {actual, expected}
}

function describes<T extends string|number>(titles: Readonly<T[]>, fn: (title: T) => void) {
  for (const title of titles)
    describe(title, () => fn(title))
}

function its<T extends string|number>(titles: Readonly<T[]>, fn: (title: T) => unknown) {
  for (const title of titles)
    //@ts-expect-error
    it(`${title}`, () => fn(title))
}