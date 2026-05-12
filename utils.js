/**
 * Automatically re-queue after splice(0),
 * allowing queued items to be discarded without
 * requiring manual re-iteration.
 * @template T
 * @param {import('./index.js').default<T>} queue
 * @returns {AsyncGenerator<T>}
 */
export async function* forever(queue) {
  for await (const item of queue) yield item;
  // Wait for new items to be pushed after exiting.
  yield* forever(queue);
};
