type D<T> = Exclude<T, undefined>

declare type Shredded<T> = (
  T extends unknown[]
  ? T
  //TODO Looks like still may be `Array`
  : T extends Record<string, unknown> 
  ? {
    [K in keyof T]?: undefined | null | Shredded<T[K]> 
  }
  : T
)
