/**
 * Optionally returns a value after a delay. This is useful if you want to add jitter or need to
 * wait for some external reason.
 *
 * @param {number} delayTime - the amount of milliseconds to wait before returning
 * @optionalParam {any} value - the value to return after the delay
 * @returns value - if defined
 */
export function delay<T>(delayTimeMs: number, value: T): Promise<T>;
export function delay<T>(delayTimeMs: number): Promise<void>;
// tslint:disable-next-line:no-any typedef (typed by overload signatures)
export function delay<T>(delayTime: any, value?: T): Promise<void | T> {
  return new Promise(
    // tslint:disable-next-line:no-any (typed by overload signatures)
    resolve => setTimeout(() => resolve(value), delayTime),
  );
}

/**
 * Optionally returns a value after deferring execution. This is useful if you need to wait for
 * anything left on the event loop.
 *
 * @optionalParam {any} value - the value to return
 * @returns value - if defined
 */
export function immediate<T>(value: T): Promise<T>;
export function immediate<T>(): Promise<void>;
// tslint:disable-next-line:no-any typedef (typed by overload signatures)
export function immediate(value?: any) {
  return delay(0, value);
}
