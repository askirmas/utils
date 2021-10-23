export type SubKeys<T1, T2> = {
  [K in Extract<keyof T1, keyof T2>]: T1[K] extends T2[K] ? K : never
}[Extract<keyof T1, keyof T2>]
export type SubType<T1, T2> = Pick<T1, SubKeys<T1, T2>>

export type IfSame<T1, T2, Then = T1, Else = never>
= [T1] extends [T2] ? [T2] extends [T1] ? Then
: Else : Else
