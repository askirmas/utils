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

  let isSource = true
  let isPatch = true

  for (let key in source) {
    const value = source[key]
    , update = patch[key]
    
    if (update === null) {
      isPatch && (isPatch = false)
      isSource && (isSource = false)
      continue
    }

    if (
      update === undefined
      || value === update
    ) {
      (update === undefined) && (isPatch = false)
      merged[key] = value
      continue
    }

    if (!(
      typeof update === "object"
      && value !== null
      && typeof value === "object"
      && $isArray(value) === $isArray(update)
    )) {
      isSource && (isSource = false)
      //@ts-expect-error
      merged[key] = update
      continue
    }

    //@ts-expect-error
    const next = deepPatch(value, update)

    if (isSource && next !== value)
      isSource = false

    if (
      isPatch
      && next !== update
    )
      isPatch = false
    
    merged[key] = next
  }

  for (let key in patch) 
    if (!(key in source)) {
      const update = patch[key]

      if (update === null || update === undefined) {
        isPatch = false
        continue
      }
      
      isSource && (isSource = false)

      //@ts-expect-error
      merged[key] = update
    }
    
  if (isSource)
    return source
  if (isPatch)
    //@ts-expect-error
    return patch

  return merged
}

