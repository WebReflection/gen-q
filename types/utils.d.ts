/**
 * Automatically re-queue even after splice(0),
 * allowing queued items to be trashed, without
 * requiring to manually re-iterate the queue again.
 * @template T
 * @param {import('./index.js').default<T>} queue
 * @returns {AsyncGenerator<T>}
 */
export function forever<T>(queue: import("./index.js").default<T>): AsyncGenerator<T>;
