import { map } from './map';

/**
 * Returns a new array of all the values in coll which pass an async truth test. This operation is
 * performed in parallel, but the results array will be in the same order as the original.
 *
 * @param coll {Array | Object} A collection to iterate over.
 * @param predicate {Function} - A truth test to apply to each item in coll. Invoked with (item,
 *     key/index), must return a boolean.
 * @returns The filtered collection
 */
export function filter<T, V>(
  input: readonly T[],
  predicate: (value: T, index: number) => Promise<V>,
): Promise<T[]>;
export function filter<T, V>(
  input: readonly T[],
  predicate: (value: T) => Promise<V>,
): Promise<T[]>;
export function filter<T extends Object, V>(
  input: T,
  predicate: (value: T[keyof T], key: keyof T) => Promise<V>,
): Promise<T[keyof T][]>;
export function filter<T extends Object, V>(
  input: T,
  predicate: (value: T[keyof T]) => Promise<V>,
): Promise<T[keyof T][]>;
// tslint:disable-next-line:no-any (types are enforced by overload signatures, validated by tests)
export function filter(input: any, predicate: any): Promise<any[]> {
  if (!input) {
    return Promise.resolve([]);
  }

  // tslint:disable-next-line:no-any
  const output: any[] = [];
  // tslint:disable-next-line:no-any
  return map(input, (value: any, key: any) =>
    predicate(value, key).then((predication: any) => {
      if (predication) {
        output.push(value);
      }
    })
  ).then(() => {
    return output;
  });
}
