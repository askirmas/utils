export {
  $all,
  nextTick,
  immediate,
  sleep
};

async function $all<S extends Record<string, unknown>>(
  source: S
  ) {
  const promises: Array<Promise<unknown>> = []
  , $return = {} as {[k in keyof S]: Awaited<S[k]>}

  for (const key in source)
    promises.push((
      async () => $return[key] = await source[key]
    )())

  await Promise.all(promises)

  return $return
}

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function immediate() {
  return new Promise(resolve => setImmediate(resolve))
}

async function nextTick() {
  return new Promise(resolve => process.nextTick(resolve))
}
