
export type primitive = null | undefined | boolean | number | string | bigint | symbol

const {isArray: $isArray} = Array

export {
  isPrimitive,
  isObject
}

function isPrimitive<T>(source: T): source is Extract<T, primitive> {
  if (source === null || source === undefined)
    return true

  switch (typeof source) {
    case "function":
    case "object":
      return false
  }

  return true
}

function isObject<T>(source: T): source is Extract<T, Record<string, any>> {
  return typeof source === "object" && !$isArray(source)
}
