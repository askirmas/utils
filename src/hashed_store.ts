type HashedMap<Id extends string, T> = Map<string, Map<Id, T>>
type HashedObj<Id extends string, T> = Record<string, Record<Id, T>>

export type {
  HashedMap,
  HashedObj
}
export {
  setMap,
  getMap,
  forEachMap,
  setObj,
  getObj,
  forEachObj
}

function setMap<Id extends string, T>(store: HashedMap<Id, T>, hashLength: number, key: Id, item: T) {
  const hash = key.substring(0, hashLength)
  let map = store.get(hash)
  map === undefined && store.set(hash, map = new Map())
  map.set(key, item)
  // return store
}
function getMap<Id extends string, T>(store: HashedMap<Id, T>, hashLength: number, key: Id) {
  const hash = key.substring(0, hashLength)
  , map = store.get(hash)
  return map === undefined ? undefined : map.get(key)
}
function forEachMap<Id extends string, T>(store: HashedMap<Id, T>, cb: (value: T, key: Id) => void) {
  store.forEach(map => map.forEach(cb))
}

function setObj<Id extends string, T>(store: HashedObj<Id, T>, hashLength: number, key: Id, item: T) {
  const hash = key.substring(0, hashLength)
  let map = store[hash]
  map === undefined && (store[hash] = map = {} as typeof map)
  map[key] = item
  // return store
}

function getObj<Id extends string, T>(store: HashedObj<Id, T>, hashLength: number, key: Id) {
  const hash = key.substring(0, hashLength)
  , map = store[hash]
  return map === undefined ? undefined : map[key]
}

function forEachObj<Id extends string, T>(store: HashedObj<Id, T>, cb: (value: T, key: Id) => void) {
  for (const hash in store) {
    const map = store[hash]
    for (const key in map)
      cb(map[key], key)
  }
}
