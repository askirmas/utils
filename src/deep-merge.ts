const {isArray: $isArray} = Array

//TODO Test
export type Shredded<T> = null | (
  T extends unknown[]
  ? T
  : T extends Record<string, unknown> 
  ? {
    [K in keyof T]: Exclude<Shredded<T[K]>, undefined>
  }
  : T
)

export default deepPatch

function deepPatch<T>(source: T, patch: Shredded<T>) :T {
  
  if (
    source === patch
    || source === null
    || typeof source !== "object"
    || typeof patch !== "object"
    || $isArray(source)
  )
    return source
  
  const $return = {} as T

  let same = true
  
  for (let key in source) {
    const value = source[key]
    //@ts-expect-error
    , update = patch[key]
    
    if (update === null) {
      same && (same = false)
      continue
    }

    if (
      //TODO not sure
      value === null
      || typeof value !== "object"
      || $isArray (value)
    ) {
      $return[key] = value
      continue
    }


  }
    
  for (let key in patch)
    if (!(key in source)) {
      const update = patch[key]

      if (update !== null && update !== undefined) {
        same && (same = false)
        //@ts-expect-error
        $return[key] = update
      }
    }

  return same ? source : $return
}

