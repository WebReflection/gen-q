/**
 * Automatically re-queue even after splice(0),
 * allowing queued items to be trashed, without
 * requiring to manually re-iterate the queue again.
 * @template T
 * @param {import('./index.js').default<T>} queue
 * @returns {AsyncGenerator<T>}
 */
export async function* forever(queue) {
  for await (const item of queue) yield item;
  // wait for new items to be pushed after exiting
  yield* forever(queue);
};
