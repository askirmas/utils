export type SubKeys<T1, T2> = {
  [K in Extract<keyof T1, keyof T2>]: T1[K] extends T2[K] ? K : never
}[Extract<keyof T1, keyof T2>]
export type SubType<T1, T2> = Pick<T1, SubKeys<T1, T2>>

export type IfSame<T1, T2, Then = T1, Else = never>
= () => T1 extends () => T2 ? () => T2 extends () => T1 ? Then
: Else : Else

export type KeysOf<T, V> = {[K in keyof T]: T[K] extends V ? K : never}[keyof T]  

export type ReKey<S, M extends {[s in keyof S]?: string}> = {
  [n in Exclude<M[keyof M], undefined>]: S[Extract<KeysOf<M, n>, keyof S>]
}

export type Fn<Args extends any[] = [], R = any> = (...args: Args) => R

export type Dict<V = unknown, T extends string = string> = Record<T, V>

export type Entry<S extends Dict> = {[k in keyof S]: [k, S[k]]}[keyof S]

export type Arg0<F extends Fn<any[]>> = Parameters<F>[0]
export type Arg1<F extends Fn<any[]>> = Parameters<F>[1]

declare const kind: unique symbol

export type Id<kind, base = string> = base & {[kind]: kind}