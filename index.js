/**
 * @type {() => void}
 */
const wake = () => {};

let result;

/**
 * @template T
 */
export default class Queue extends Array {
  static {
    /**
     * @template T,R
     * @param {Queue<T>} self
     * @param {R} value
     * @returns {R}
     */
    result = (self, value) => {
      if (self.#iterating) self.#wake();
      return value;
    };
  }

  #iterating = false;

  #wake = wake;

  /**
   * @param {...T} items
   */
  constructor(...items) {
    //@ts-ignore
    super().push(...items);
  }

  /**
   * @override
   * @param  {...T} items
   * @returns {number}
   */
  push(...items) {
    return result(this, super.push(...items));
  }

  /**
   * @param {number} start
   * @param {number} [deleteCount=this.length]
   * @param  {...T} [items]
   * @returns {Queue<T>[]}
   */
  splice(start, deleteCount = this.length, ...items) {
    return result(this, super.splice(start, deleteCount, ...items));
  }

  get [Symbol.toStringTag]() {
    return 'Queue';
  }

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
      if (!this.length) await new Promise(
        wake => (this.#wake = /** @type {() => void} */(wake))
      );

      // if wake was called but there are no items left, break the loop
      // this effectively allow to reset and iterate again with splice(0)
      // ⚠️ if no reset is meant, do not splice the queue!
      if (this.length) yield this.shift();
      else this.#iterating = false;
    }
  }
}
