import type { Dict } from "./ts-swiss.types"

type Assoc<T> = Dict<T> | Map<string, T> // | Sized<T>

const {keys: $keys, defineProperty: $defineProperty} = Object
, sizeSymbol: unique symbol = Symbol("size")

type Sized<T> = Dict<T> & {[sizeSymbol]: number}

export {
  sizeObject,
  $size,
  $set,
  $get
}

function sizeObject<T>(assoc?: Dict<T>) {
  return (assoc === undefined
  ? $defineProperty({}, sizeSymbol, {
    "value": 0,
    "enumerable": false
  })
  : $defineProperty(assoc, sizeSymbol, {
    "value": $keys(assoc).length,
    "enumerable": false
  })) as Sized<T>
}

function $size<T>(assoc: Dict<T> & {[sizeSymbol]?: number}) {
  const size = assoc[sizeSymbol]
  return size === undefined
  ? $keys(assoc).length
  : size
}

function $set<T>(assoc: Assoc<T>, key: string, value: T) {
  assoc instanceof Map
  ? assoc.set(key, value)
  : assoc[key] = value

  return value
}

function $get<T>(assoc: Assoc<T>, key: string) {
  return assoc instanceof Map
  ? assoc.get(key)
  : assoc[key]
}