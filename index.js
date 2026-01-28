const wake = () => {};

/**
 * @template T
 * @extends Array<T>
 */
export default class Queue extends Array {
  #iterating = false;
  #wake = wake;

  /**
   * @param {...T} items
   */
  constructor(...items) {
    super().push(...items);
  }

  /**
   * @param {...T} items
   * @returns {number}
   */
  push(...items) {
    const result = super.push(...items);
    this.#wake();
    return result;
  }

  /**
   * @param {number} start
   * @param {number} [deleteCount]
   * @param {...T} [items]
   * @returns {T[]}
   */
  splice(start, deleteCount = this.length, ...items) {
    const result = super.splice(start, deleteCount, ...items);
    this.#wake();
    return result;
  }

  [Symbol.toStringTag] = 'Queue';

  /**
   * @returns {AsyncGenerator<T>}
   */
  async *[Symbol.asyncIterator]() {
    // onlw queue owner should be able to iterate once this reference
    // this error won't break the loop anyway ...
    if (this.#iterating) throw new Error('Queue is already iterating');
    this.#iterating = true;
    while (this.#iterating) {
      // if no items, wait until push calls wake()
      if (!this.length) await new Promise(wake => (this.#wake = wake));

      // if wake was called but there are no items left, break the loop
      // this effectively allow to reset and iterate again with splice(0)
      // ⚠️ if no reset is meant, do not splice the queue!
      if (this.length) yield this.shift();
      else this.#iterating = false;
    }
  }
}
