type D<T> = Exclude<T, undefined>

declare type Shredded<T> = (
  T extends unknown[]
  ? T
  : T extends Record<string, unknown> 
  ? {
    [K in keyof T]?: Shredded<T[K]> | (
      undefined extends T[K]
      ? null
      : never
    )
  }
  : T
)
