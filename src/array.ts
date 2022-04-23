import type { Fn } from "./ts-swiss.types"

export {
  fill
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

