/**
 * Automatically re-queue after splice(0),
 * allowing queued items to be discarded without
 * requiring manual re-iteration.
 * @template T
 * @param {import('./index.js').default<T>} queue
 * @returns {AsyncGenerator<T>}
 */
export function forever<T>(queue: import("./index.js").default<T>): AsyncGenerator<T>;
