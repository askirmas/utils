import type { Arg0 } from "./ts-swiss.types"

export class HashedStore<T, Id, H> {
  protected store = new Map<H, Map<Id, T>>() 

  constructor(
    readonly hash: (value: Id) => H,
    _tsHint?: T
  ) {}

  set(key: Arg0<typeof this.hash>, item: T) {
    const hash = this.hash(key)
    , {store} = this
    
    let map = store.get(hash)
    if (map === undefined)
      store.set(hash, map = new Map())

    map.set(key, item)

    return this
  }

  get(key: Arg0<typeof this.hash>) {
    const hash = this.hash(key)    
    , map = this.store.get(hash)

    return map === undefined
    ? undefined
    : map.get(key)
  }


  has(key: Arg0<typeof this.hash>) {
    const hash = this.hash(key)    
    , map = this.store.get(hash)

    return map === undefined
    ? false
    : map.has(key)
  }

  delete(key: Arg0<typeof this.hash>) {
    const hash = this.hash(key)    
    , map = this.store.get(hash)

    if (map === undefined)
      return false

    const r = map.delete(key)

    if (map.size === 0)
      this.store.delete(hash)

    return r
  }

  forEach(cb: (value: T, key: Id) => void) {
    this.store.forEach(map => map.forEach(cb))
  }
}