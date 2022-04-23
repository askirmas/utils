type RecMap<T> = Map<string, T | RecMap<T>>
export class WideStore<T, K extends keyof T> {
  protected _size = 0
  protected store: RecMap<T> = new Map()

  constructor(
    readonly key: K,
    readonly indexing: (value: T[K]) => string[],
    _tsHint: T
  ) {}

  get size() {
    return this._size
  }

  protected create(obj: T, force: boolean) {
    const keys = this.indexing(obj[this.key])
    , stop  = keys.length - 1
    
    let pointer = this.store
    , isNew = false

    for (let k = 0; k < stop; k++) {
      const key = keys[k]

      if (isNew) {
        const next: RecMap<T> = new Map()
        pointer.set(key, next)
        pointer = next
      } else {
        let next = pointer.get(key) as undefined|RecMap<T>

        if (next === undefined) {
          isNew = true
          next = new Map()
          pointer.set(key, next)
        }

        pointer = next!
      }
    }

    const leafKey = keys[stop]
    , has = pointer.has(leafKey)

    if (has)
      this._size++
    

    if (force || !has)
      pointer.set(leafKey, obj)

    return this
  }

  protected act<Op extends "get"|"has"|"delete">(key: T[K], op: Op) {
    const keys = this.indexing(key)
    , stop = keys.length - (op === "delete" ? 1 : 0)

    let pointer = this.store

    for (let k = 0; k < stop; k++) {
      const key = keys[k]
      , next = pointer.get(key) as undefined|RecMap<T>

      if (next === undefined)
        return op === "has" ? false : undefined

      pointer = next
    }

    const leafKey = keys[stop]

    if (op === "delete") {
      const leaf = pointer.get(leafKey) as T | undefined

      if (leaf === undefined)
        return undefined
      else {
        this._size--
        pointer.delete(leafKey)
        return leaf
      }
    }
    
    return op === "get" ? pointer as unknown as T : true
  }

  add(obj: T): this {
    return this.create(obj, false)
  }

  set(obj: T): this {
    return this.create(obj, true)
  }

  has(key: T[K]): boolean {
    //@ts-expect-error
    return this.act(key, "has")
  }

  get(key: T[K]): T | undefined {
    //@ts-expect-error
    return this.act(key, "get")
  }

  delete(obj: T[K]): T | undefined {
    //@ts-expect-error
    return this.act(obj, "delete")
  }
  
  reset() {
    this.store = new Map()
    this._size = 0
    return this
  }
}