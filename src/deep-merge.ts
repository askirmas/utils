const {isArray: $isArray} = Array

export default deepPatch

function deepPatch<T>(source: T, patch: Shredded<T>) :T {
  if (patch === undefined || patch === source)
    return source

  if (
    typeof patch !== "object"
    || !(
      source !== null
      && typeof source === "object"
    )
    || $isArray(patch) !== $isArray(source)
  )
    //@ts-expect-error
    return patch
  
  if ($isArray(source)) {
    const {length} = source
    , p = patch as typeof patch & unknown[]
    , {"length": patchLen} = p

    if (length !== patchLen)
      //@ts-expect-error
      return p
    
    for (let i = length; i--;)
      if (p[i] !== source[i])
        //@ts-expect-error
        return p
    
    return source
  }
 
  const merged = {} as T

  let same = true
  
  for (let key in source) {
    const value = source[key]
    , update = patch[key]
    
    if (update === null) {
      same && (same = false)
      continue
    }

    if (
      update === undefined
      || value === update
    ) {
      merged[key] = value
      continue
    }

    if (!(
      typeof update === "object"
      && value !== null
      && typeof value === "object"
      && $isArray(value) === $isArray(update)
    )) {
      same && (same = false)
      //@ts-expect-error
      merged[key] = update
      continue
    }

    //@ts-expect-error
    const next = deepPatch(value, update)

    if (same && next !== value)
      same = false

    merged[key] = next
  }

  for (let key in patch) 
    if (!(key in source)) {
      const update = patch[key]

      if (update === null)
        continue
      
      same && (same = false)

      //@ts-expect-error
      merged[key] = update
    }
    
  return same ? source : merged
}

