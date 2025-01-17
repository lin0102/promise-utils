export interface SettledPromises<T, V> {
  errors: V[];
  results: T[];
}
/**
 * Attempts to settle all promises in promises in parallel, calling errFn when a promise rejects.
 * Similar to Promise.all, but does not fail fast. For resolved promises, the result array contains
 * resolved values in the same order as the promises. For rejected promises, the error array
 * contains the return values of errFn in the same order as the promises.
 *
 * @param {Promise<T>[]} promises - An array of promises to attempt to settle.
 * @param {Function} errFn - The function to call when a promise rejects.
 *     Accepts an error and optionally the index of the promise that caused that error.
 *
 * @returns A list of resolved and rejected values of promises.
 */
export function settleAll<T, V>(
  promises: readonly Promise<T>[],
  // tslint:disable-next-line:no-any (no way to guarantee error typings)
  errFn?: (err: any, ind: number) => Promise<V>,
): Promise<SettledPromises<T, V>>;
export function settleAll<T, V>(
  promises: readonly Promise<T>[],
  // tslint:disable-next-line:no-any (no way to guarantee error typings)
  errFn?: (err: any) => Promise<V>,
): Promise<SettledPromises<T, V>>;
export function settleAll<T, V>(
  promises: readonly Promise<T>[],
  // tslint:disable-next-line:no-any (no way to guarantee error typings)
  errFn?: (err: any, ind: number) => V,
): Promise<SettledPromises<T, V>>;
export function settleAll<T, V>(
  promises: readonly Promise<T>[],
  // tslint:disable-next-line:no-any (no way to guarantee error typings)
  errFn?: (err: any) => V,
): Promise<SettledPromises<T, V>>;
export function settleAll<T, V>(
  promises: readonly Promise<T>[],
  // tslint:disable-next-line:no-any (no way to guarantee error typings)
  errFn: (err: any, ind: number) => V = err => err,
): Promise<SettledPromises<T, V>> {
  return Promise.all(
    (promises || []).map((p, i) => {
      return p.then(results => {return {results}})
      .catch(err => {
        return Promise.resolve(errFn(err, i)).then((errors: V) => {return {errors}})
      })
      // try {
      //   return { results: await p };
      // } catch (err) {
      //   return { errors: await errFn(err, i) };
      // }
    }),
  ).then((intermediateResults: { errors?: V; results?: T }[]) => {
    const settledPromises: SettledPromises<T, V> = { results: [], errors: [] };
    for (const result of intermediateResults) {
      for (const key in result) {
        // @ts-ignore typings line up, but typescript is hard pressed to agree
        settledPromises[key].push(result[key]);
      }
    }
    return settledPromises;
  });
}
