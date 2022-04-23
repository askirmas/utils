import type {
  Dict,
  Fn
} from "./ts-swiss.types"

export {
  fill,
  sort,
  comparer
}

function fill<T>(length: number, producer: T & (
  Exclude<T, Fn> 
  | (T extends (i: number, arr: Array<infer R>) => infer R ? (i: number, arr: R[]) => R : never)
)): Array<
  Exclude<T, Fn> 
  | (T extends (i: number, arr: Array<infer R>) => infer R ? R : never)
> {

  if (typeof producer !== "function")
    return new Array(length).fill(producer)

  const array = new Array()

  for (let i = 0; i < length; i++)
    //@ts-expect-error
    array[i] = producer(i, array)

  return array
}

function sort<T extends Dict>(source: T[], order: {[p in keyof T]?: -1 | 1}) {
  return source.sort(comparer(order))
}

function comparer<P extends string>(order: {[p in P]?: -1 | 1}) {
  return <T extends {[p in P]: unknown}>(a: T, b: T) => {
    for (const key in order) {
      const sign = a[key] < b[key] ? -1 : a[key] > b[key] ? 1 : 0

      if (sign !== 0)
        return sign * order[key]!

    }

    return 0
  } 
}