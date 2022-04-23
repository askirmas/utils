export class WideStore<T, K extends keyof T> {
  protected _size = 0
  protected store: any = {}

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

      if (isNew)
        pointer = pointer[key] = {}
      else {
        const next = pointer[key]

        if (next === undefined) {
          isNew = true
          pointer[key] = {}
        }

        pointer = pointer[key]
      }
    }

    const leafKey = keys[stop]
    
    leafKey in pointer || this._size++

    if (force || !(leafKey in pointer))
      pointer[leafKey] = obj

    return this
  }

  protected act(key: T[K], op: "get"|"has"|"delete") {
    const keys = this.indexing(key)
    , stop = keys.length - (op === "delete" ? 1 : 0)

    let pointer = this.store

    for (let k = 0; k < stop; k++) {
      const key = keys[k]

      if (pointer[key] === undefined)
        return op === "has" ? false : undefined

      pointer = pointer[key]
    }

    const leafKey = keys[stop]

    if (op === "delete") {
      if (leafKey in pointer) {
        this._size--
        const deleted = pointer[leafKey]
        delete pointer[leafKey]
        return deleted
      } else {
        return undefined
      }
    }
    
    return op === "get" ? pointer : true
  }

  add(obj: T): this {
    return this.create(obj, false)
  }

  set(obj: T): this {
    return this.create(obj, true)
  }

  has(key: T[K]): boolean {
    return this.act(key, "has")
  }

  get(key: T[K]): T | undefined {
    return this.act(key, "get")
  }

  delete(obj: T[K]): T | undefined {
    return this.act(obj, "delete")
  }
  
  reset() {
    this.store = {}
    this._size = 0
    return this
  }
}