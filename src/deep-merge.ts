const {isArray: $isArray} = Array

export default deepPatch

function deepPatch<T>(source: T, patch: T) :T|undefined {
  if (
    patch === null
  )
    return undefined;

  if (
      source === undefined
    )
      return patch
  
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
    , update = patch[key]
    
    if (update === null) {
      same && (same = false)
      continue
    }

    $return[key] = value
  }
    
  for (let key in patch)
    if (!(key in source)) {
      const update = patch[key]

      if (update !== null && update !== undefined) {
        same && (same = false)
        $return[key] = update
      }
    }

  return same ? source : $return
}