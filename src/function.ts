import type { Fn } from "./ts-swiss.types";

const {defineProperty} = Object

export {
  nop,
  idfn,
  renameFn,
  deanon
};

function renameFn<F extends Fn>(name: string, fn: F) {
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/name#inferred_function_names
  return defineProperty(fn, "name", {
    "value": name
  })
}

function deanon<F extends Fn>(name: string, fn: F) {
  return fn.name ? fn : renameFn(name, fn)
}

function nop(..._: any[]) {}
/** Identical function */
function idfn<T>(source: T) {return source}