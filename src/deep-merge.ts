const {isArray: $isArray} = Array
, unknownMark: unique symbol = Symbol()

export {
  deepMerge
}

// TODO `target` 3rd arg
function deepMerge<Source>(source: Source, patch: Shredded<Source>): Source {
  const simpleAssign = deepMergeHelper(source, patch, unknownMark)

  if (simpleAssign !== unknownMark)
    return simpleAssign as Source

  const merged = ($isArray(source) ? [] : {}) as Source

  let isSource = true
  , isPatch = true

  for (const key in source) {
    if (!(key in patch && patch[key] !== undefined)) {
      merged[key] = source[key]
      isPatch = false
      continue
    }
    
    const sourceValue = source[key]
    , patchValue = patch[key]
    , simpleAssign = deepMergeHelper(sourceValue, patchValue, unknownMark)
    , resultValue = simpleAssign !== unknownMark ? simpleAssign
    : deepMerge(sourceValue,
      //@ts-expect-error
      patchValue
    )

    if (resultValue !== undefined)
      //@ts-expect-error
      merged[key] = resultValue

    isSource = isSource && resultValue === sourceValue
    isPatch = isPatch && resultValue === patchValue 
  }

  for (const key in patch) {
    if (key in source)
      continue

    const patchValue = patch[key]

    if (patchValue === null)
      continue
    
    //@ts-expect-error
    merged[key] = patchValue
    isSource = false
  }

  return isSource ? source
  : isPatch ? patch as Source
  : merged
}

function deepMergeHelper<S, P, U>(source: S, patch: P, unknown: U) {
  switch (patch) {
    case undefined:
    //@ts-ignore
    case source:
      return source
    case null:
      return 
  }

  if (
    typeof patch !== "object"
    || $isArray(source) !== $isArray(patch)
  )
    return patch

  return unknown
}
